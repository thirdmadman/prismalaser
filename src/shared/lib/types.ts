import { Edge, Node } from 'reactflow';

export type RelationType = '1-1' | '1-n' | 'm-n';
export type RelationSide = 'source' | 'target';

export interface SchemaError {
  reason: string;
  row: string;
}

export interface ModelRelationData {
  side: RelationSide;
  type: RelationType;
  name: string;
}

export interface EnumNodeData {
  type: 'enum';
  name: string;
  dbName?: string | null;
  documentation?: string;
  values: Array<string>;
}

export interface ModelNodeData {
  type: 'model';
  name: string;
  dbName?: string | null;
  documentation?: string;
  columns: Array<{
    name: string;
    type: string;
    displayType: string;
    kind: string;
    documentation?: string;
    isList: boolean;
    isRequired: boolean;
    defaultValue?: string | null;
    relationData: ModelRelationData | null;
  }>;
}

export interface RelationEdgeData {
  relationType: RelationType;
}

export enum ErrorTypes {
  Prisma,
  Other,
}

export interface DMMFToElementsResult {
  nodes: Array<Node<EnumNodeData> | Node<ModelNodeData>>;
  edges: Array<Edge>;
}
