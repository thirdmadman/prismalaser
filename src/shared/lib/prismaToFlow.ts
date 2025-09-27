import { count, groupBy, pick } from 'ramda';

import type {
  DMMFToElementsResult,
  IEnumNodeData,
  IModelNodeData,
  IModelNodeDataColumn,
  IModelRelationData,
  TCustomEdge,
  TCustomNode,
  TCustomNodeData,
  TRelationSide,
  TRelationType,
} from './types';
import type { DMMF } from '@prisma/generator-helper';
import type { ElkNode } from 'elkjs';
import type { Edge } from 'reactflow';

const letters = ['A', 'B'];

interface IGotModelRelations {
  name: string;
  dbName?: string;
  type: TRelationType;
  virtual?: {
    name: string;
    field: {
      name: string;
      type: string;
    };
  };
  fields: Array<{
    name: string;
    tableName: string;
    side: TRelationSide;
    type: string;
  }>;
}

const getRelationType = (listCount: number): TRelationType => {
  if (listCount > 1) {
    return 'm-n';
  }

  if (listCount === 1) {
    return '1-n';
  }

  return '1-1';
};

const getRelationSide = (field: DMMF.Field): TRelationSide => {
  if (field.relationFromFields?.length || field.relationToFields?.length) {
    return 'source';
  }

  return 'target';
};

// Functions for various IDs so that consistency is ensured across all parts of the app easily.
export const generateEdgeId = (target: string, source: string, targetColumn: string) =>
  `edge-${target}-${targetColumn}-${source}`;

export const generateEnumEdgeTargetHandleId = (table: string, column: string) => `${table}-${column}`;

const generateImplicitManyToManyModelNodeId = (relation: string) => `_${relation}`;

export const generateRelationEdgeSourceHandleId = (table: string, relation: string, column: string) =>
  `${table}-${relation}-${column}`;

export const generateRelationEdgeTargetHandleId = (table: string, relation: string, column: string) =>
  `${table}-${relation}-${column}`;

const generateVirtualTableName = (relation: string, table: string) => `${relation}-${table}`;

/**
 * Filter through a schema to find all the models that are part of a
 * relationship, as well as what side of the relationships they are on.
 */
const getModelRelations = ({ models }: DMMF.Datamodel): Record<string, IGotModelRelations> => {
  const objectMapping = models.map((m) => {
    const groupByObject = m.fields
      // Don't bother processing any fields that aren't part of a relationship.
      .filter((f) => f.relationName)
      .map((f) => ({ ...f, tableName: m.name }));

    const result = groupByObject.reduce<Record<string, typeof groupByObject>>((acc, f) => {
      const key = f.relationName;
      if (!key) {
        return acc;
      }

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(f);
      return acc;
    }, {});

    return result;
  });

  // Match both ends of relation together, and collapse everything into the same object.
  // (relation names should be unique so this is safe).
  const relationsObject = objectMapping.reduce((acc, curr) => {
    for (const [key, value] of Object.entries(curr)) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      acc[key] = acc[key] ? acc[key].concat(value) : value;
    }
    return acc;
  }, {});

  const groupedRelations: Record<string, Array<DMMF.Field & { tableName: string }>> = Object.fromEntries(
    Object.entries(relationsObject).filter(([key]) => key !== 'undefined')
  );

  const output = Object.keys(groupedRelations).map((key) => {
    const fields = groupedRelations[key];

    const listCount = count((f) => f.isList, fields);
    const type = getRelationType(listCount);

    const relationFields = fields.map((f) => ({
      name: f.name,

      tableName: f.tableName,

      side: getRelationSide(f),

      type: f.type,
    }));
    return {
      name: key,
      type,
      fields: relationFields,
    };
  });

  const withVirtuals = Object.values(output).reduce<Record<string, IGotModelRelations>>((acc, curr) => {
    if (curr.type !== 'm-n') {
      acc[curr.name] = curr;
      return acc;
    }

    for (const [i, field] of curr.fields.entries()) {
      const newName = generateVirtualTableName(curr.name, field.tableName);
      // There's probably a better way around this
      const virtualLetter = letters[i] || '';

      acc[newName] = {
        name: newName,

        dbName: curr.name,
        type: '1-n',
        virtual: {
          name: generateImplicitManyToManyModelNodeId(curr.name),
          field: { name: virtualLetter, type: field.tableName },
        },
        // Reuse current field straight up because they're always `target`.
        fields: [
          field,
          {
            name: virtualLetter,
            tableName: generateImplicitManyToManyModelNodeId(curr.name),
            side: 'source',
            type: field.tableName,
          },
        ],
      };
    }

    return acc;
  }, {});

  return withVirtuals;
};

/**
 * Filter through a schema to find all the models that refer to a defined Enum.
 */
const getEnumRelations = ({ models }: DMMF.Datamodel) =>
  models
    .map((m) => {
      const fields = m.fields.filter((f) => f.kind === 'enum');
      const relations = fields.map((f) => ({
        enum: f.type,
        column: f.name,
      }));

      return {
        name: m.name,
        relations,
      };
    })
    .filter((m) => m.relations.length);

/**
 * Map found relationships into React Flow edges.
 */
const relationsToEdges = (
  modelRelations: ReturnType<typeof getModelRelations>,
  enumRelations: ReturnType<typeof getEnumRelations>
) => {
  let result: Array<TCustomEdge> = [];

  // Enum edges are dead shrimple
  for (const relation of enumRelations) {
    const { relations } = relation;

    const edges = relations.map(
      (r): Edge => ({
        id: generateEdgeId(relation.name, r.enum, r.column),
        type: 'smoothstep',
        source: r.enum,
        target: relation.name,
        sourceHandle: r.enum,
        targetHandle: generateEnumEdgeTargetHandleId(relation.name, r.column),
      })
    );

    result = result.concat(edges);
  }

  for (const relation of Object.values(modelRelations)) {
    const base = {
      id: `edge-${relation.name}`,
      type: 'relation',
      label: relation.name,
      data: { relationType: relation.type },
    };

    const source = relation.fields.find((f) => f.side === 'source');
    let target = relation.fields.find((f) => f.side === 'target');

    if (!source) {
      throw new Error('Invalid source');
    }

    if (!target && relation.virtual) {
      target = relation.fields.find((field) => field.tableName === relation.virtual?.name);
    }

    if (!target) {
      throw new Error('Invalid target');
    }

    const sourceHandle = generateRelationEdgeSourceHandleId(source.tableName, relation.name, source.name);
    const targetHandle = generateRelationEdgeTargetHandleId(target.tableName, relation.name, target.name);

    result.push({
      ...base,
      source: source.tableName,
      target: target.tableName,
      sourceHandle,
      targetHandle,
    });
  }

  return result;
};

/**
 * Map a Prisma datamodel into React Flow node data.
 * Does not generate position data.
 */
const generateNodes = ({ enums, models }: DMMF.Datamodel, relations: Record<string, IGotModelRelations>) => {
  let nodes = [] as Array<TCustomNodeData>;

  nodes = nodes.concat(generateModelNodes(models, relations));
  nodes = nodes.concat(generateImplicitModelNodes(relations));
  nodes = nodes.concat(generateEnumNodes(enums));

  return nodes;
};

const generateEnumNodes = (enums: ReadonlyArray<DMMF.DatamodelEnum>) => {
  const enumNodes: Array<IEnumNodeData> = enums.map(({ name, dbName, documentation, values }) => ({
    type: 'enum',
    name,
    dbName,
    documentation,
    values: values.map(({ name }) => name),
  }));

  return enumNodes;
};

const generateModelNodes = (models: ReadonlyArray<DMMF.Model>, relations: Record<string, IGotModelRelations>) => {
  const data: Array<IModelNodeData> = models.map(({ name, dbName, documentation, fields }) => {
    const columns: Array<IModelNodeDataColumn> = fields.map((f) => {
      // `isList` and `isRequired` are mutually exclusive as per the spec
      const displayType = f.type + (f.isList ? '[]' : !f.isRequired ? '?' : '');
      let defaultValue: string | null = null;

      if (f.hasDefaultValue && f.default !== undefined)
        if (typeof f.default === 'object' && 'name' in f.default)
          // Column has a function style default
          defaultValue = `${f.default.name}(${f.default.args.map((arg) => JSON.stringify(arg)).join(',')})`;
        // Enums only have a scalar as default value
        else if (f.kind === 'enum') defaultValue = f.default.toString();
        else defaultValue = JSON.stringify(f.default);

      let relationData: IModelRelationData | null = null;

      if (f.relationName) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const relData = relations[f.relationName] || relations[generateVirtualTableName(f.relationName, name)];
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const thisRel = relData?.fields.find((g) => g.name === f.name && g.tableName === name);

        const relationSide = thisRel?.side ?? null;

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!relData || !relationSide) {
          throw new Error(`Relation ${f.relationName ?? 'unknown'} not found`);
        }

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        relationData = relData
          ? {
              name: relData.name,
              type: relData.type,
              side: relationSide,
            }
          : null;
      }

      return {
        ...pick(['name', 'kind', 'documentation', 'isList', 'isRequired', 'type'], f),
        displayType,
        defaultValue,
        relationData,
      };
    });

    const modelNodeData: IModelNodeData = {
      type: 'model',
      name,
      dbName,
      documentation,
      columns,
    };

    return modelNodeData;
  });

  return data;
};

/**
 * Generates intermediary tables to represent how implicit many-to-many
 * relationships work under the hood (mostly because I'm too lazy to distinguish
 * between implicit and explicit).
 */
const generateImplicitModelNodes = (relations: Record<string, IGotModelRelations>) => {
  const hasVirtuals = Object.values(relations).filter((rel) => rel.virtual);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const grouped = Object.values(groupBy((rel) => rel.virtual!.name, hasVirtuals)).map(
    (rel: Array<IGotModelRelations> | undefined) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const fields = rel!.map((r) => r.virtual!.field);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return { relationName: rel![0].dbName!, fields };
    }
  );

  const implicitModelNodes: Array<IModelNodeData> = Object.entries(grouped).map(([name, { relationName, fields }]) => {
    const columns: Array<IModelNodeDataColumn> = fields.map((col, i) => ({
      name: letters[i],
      kind: 'scalar',
      isList: false,
      isRequired: true,
      defaultValue: null,
      type: col.type,
      displayType: col.type,
      relationData: {
        name: generateVirtualTableName(relationName, col.type),
        side: 'source',
        type: '1-n',
      },
    }));

    return {
      type: 'model',
      name,
      dbName: null,
      columns,
    };
  });

  return implicitModelNodes;
};

const extractNodePositionDataFromCommentString = (commentString: string) => {
  /// @Prismalaser.position(x: 100, y: -100)

  const positionCommentSignature = '@Prismalaser.position';

  const positionDataCommentStartIndex = commentString.lastIndexOf(positionCommentSignature);
  if (positionDataCommentStartIndex < 0) {
    return null;
  }

  let positionOfNewLine = commentString.indexOf('\n', positionDataCommentStartIndex);
  if (positionOfNewLine < 0) {
    positionOfNewLine = commentString.length;
  }

  let positionDataString = commentString.substring(
    positionDataCommentStartIndex + positionCommentSignature.length,
    positionOfNewLine
  );

  positionDataString = positionDataString.trim().replaceAll(' ', '').replaceAll('\t', '');

  if (positionDataString.length < 9) {
    return null;
  }

  const positionDataStartIndex = positionDataString.indexOf('(');
  const positionDataEndIndex = positionDataString.indexOf(')', positionDataStartIndex + 1);

  if (positionDataStartIndex < 0 || positionDataEndIndex < 0 || positionDataStartIndex > positionDataEndIndex) {
    return null;
  }

  const positionDataXStartIndex = positionDataString.indexOf('x:');
  const positionDataYStartIndex = positionDataString.indexOf('y:');
  const positionDataSeparator = positionDataString.indexOf(',');

  if (positionDataXStartIndex < 0 || positionDataYStartIndex < 0 || positionDataSeparator < 0) {
    return null;
  }

  const isXPositionLeading = positionDataXStartIndex < positionDataYStartIndex;

  let x = NaN;
  let y = NaN;

  if (isXPositionLeading) {
    x = parseInt(positionDataString.substring(positionDataXStartIndex + 2, positionDataSeparator), 10);
    y = parseInt(positionDataString.substring(positionDataYStartIndex + 2, positionDataEndIndex), 10);
  } else {
    x = parseInt(positionDataString.substring(positionDataXStartIndex + 2, positionDataEndIndex), 10);
    y = parseInt(positionDataString.substring(positionDataYStartIndex + 2, positionDataSeparator), 10);
  }

  if (isNaN(x) || isNaN(y)) {
    return null;
  }

  return {
    x,
    y,
  };
};

/**
 * Takes in plain React Flow node data and positions them either based on an Elk
 * reflow, previous layout state, or with fresh positions.
 */
const positionNodes = (nodeData: Array<TCustomNodeData>, previousNodes: Array<TCustomNode>, layout: ElkNode | null) =>
  nodeData.map((n) => {
    const positionedNode = layout?.children?.find((layoutNode) => layoutNode.id === n.name);
    const previousNode = previousNodes.find((prev) => prev.id === n.name);

    const schemaNodeDocumentation = n.documentation;
    const isNodeHasDocumentation = !!schemaNodeDocumentation;
    let schemaNodePosition = null;

    /// @Prismalaser.position(x: 100, y: -100)

    // We can user this to replace old comments
    // const output = input.replace(
    //   /\/\/\/\s*@prla-position\s*\{"x":(-?\d+),"y":(-?\d+)\}/g,
    //   '/// @Prismalaser.position(x:$1,y:$2)'
    // );

    if (isNodeHasDocumentation) {
      const positionData = extractNodePositionDataFromCommentString(schemaNodeDocumentation);

      if (positionData?.x && positionData.y) {
        schemaNodePosition = { x: positionData.x, y: positionData.y };
      }
    }

    const nodeReactFlowData = {
      id: n.name,
      type: n.type,
      dragHandle: '.drag-handle__custom',
      position: {
        x: positionedNode?.x ?? schemaNodePosition?.x ?? previousNode?.position.x ?? 0,
        y: positionedNode?.y ?? schemaNodePosition?.y ?? previousNode?.position.y ?? 0,
      },
      width: previousNode?.width ?? 0,
      height: previousNode?.height ?? 0,
      data: n,
    };

    return nodeReactFlowData;
  });

/**
 * Entrypoint into creating a React Flow network from the Prisma datamodel.
 */
export const generateFlowFromDMMF = (
  datamodel: DMMF.Datamodel,
  previousNodes: Array<TCustomNode>,
  layout: ElkNode | null
) => {
  const modelRelations = getModelRelations(datamodel);
  const enumRelations = getEnumRelations(datamodel);
  const nodeData = generateNodes(datamodel, modelRelations);

  const nodes: Array<TCustomNode> = positionNodes(nodeData, previousNodes, layout);
  const edges = relationsToEdges(modelRelations, enumRelations);

  const result: DMMFToElementsResult = {
    nodes,
    edges,
  };

  return result;
};
