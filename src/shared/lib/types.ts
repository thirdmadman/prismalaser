import type { Edge, Node } from '@xyflow/react';

export type TRelationType = '1-1' | '1-n' | 'm-n';
export type TRelationSide = 'source' | 'target';

export interface ISchemaError {
  reason: string;
  row: string;
}

export interface IModelRelationData extends Record<string, unknown> {
  side: TRelationSide;
  type: TRelationType;
  name: string;
}

export interface IEnumNodeData extends Record<string, unknown> {
  type: 'enum';
  name: string;
  dbName?: string | null;
  documentation?: string;
  values: Array<string>;
}

export interface IModelNodeDataColumn {
  name: string;
  type: string;
  displayType: string;
  kind: string;
  documentation?: string;
  isList: boolean;
  isRequired: boolean;
  defaultValue?: string | null;
  relationData: IModelRelationData | null;
}

export interface IModelNodeData extends Record<string, unknown> {
  type: 'model';
  name: string;
  dbName?: string | null;
  documentation?: string;
  columns: Array<IModelNodeDataColumn>;
}

export interface IRelationEdgeData extends Record<string, unknown> {
  relationType: TRelationType;
}

export type TCustomNodeData = IEnumNodeData | IModelNodeData;
export type TCustomNode = Node<TCustomNodeData>;
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCustomEdge = Edge<IRelationEdgeData | {}>;

export interface DMMFToElementsResult {
  nodes: Array<TCustomNode>;
  edges: Array<TCustomEdge>;
}
