import { Edge, Node } from 'reactflow';

export type TRelationType = '1-1' | '1-n' | 'm-n';
export type TRelationSide = 'source' | 'target';

export interface ISchemaError {
  reason: string;
  row: string;
}

export interface IModelRelationData {
  side: TRelationSide;
  type: TRelationType;
  name: string;
}

export interface IEnumNodeData {
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

export interface IModelNodeData {
  type: 'model';
  name: string;
  dbName?: string | null;
  documentation?: string;
  columns: Array<IModelNodeDataColumn>;
}

export interface IRelationEdgeData {
  relationType: TRelationType;
}

export enum TErrorTypes {
  Prisma,
  Other,
}

export type TCustomNodeData = IEnumNodeData | IModelNodeData;
export type TCustomNode = Node<TCustomNodeData>;
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type TCustomEdge = Edge<IRelationEdgeData | {}>;

export interface DMMFToElementsResult {
  nodes: Array<TCustomNode>;
  edges: Array<TCustomEdge>;
}
