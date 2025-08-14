import { type PayloadAction } from '@reduxjs/toolkit';

import type { DMMF } from '@prisma/generator-helper';
import type { ElkNode } from 'elkjs';
import { createAppSlice } from '@/app/createAppSlice';
import { generateFlowFromDMMF } from '@/shared/lib/prismaToFlow';
import type { TCustomEdge, TCustomNode } from '@/shared/lib/types';

interface IViewport {
  x: number;
  y: number;
  zoom: number;
}

export interface IFlowViewSliceSliceState {
  nodes: Array<TCustomNode>;
  edges: Array<TCustomEdge>;
  viewport: IViewport;
  isFirstSchemaRender: boolean;
}

const initialState: IFlowViewSliceSliceState = {
  nodes: [],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 },
  isFirstSchemaRender: false,
};

export const flowViewSlice = createAppSlice({
  name: 'flowView',
  initialState,
  reducers: (create) => ({
    setNodes: create.reducer((state, action: PayloadAction<Array<TCustomNode>>) => {
      state.nodes = action.payload;
    }),
    setViewport: create.reducer((state, action: PayloadAction<IViewport>) => {
      state.viewport = action.payload;
    }),
    rearrangeNodes: create.reducer(
      (state, action: PayloadAction<{ dmmf: DMMF.Datamodel | null; layout: ElkNode | null }>) => {
        if (state.nodes.length === 0) {
          state.isFirstSchemaRender = true;
        }
        const { dmmf, layout } = action.payload;

        const { nodes } = state;

        let newNodes: Array<TCustomNode> = [];
        let newEdges: Array<TCustomEdge> = [];

        if (dmmf) {
          const { nodes: generatedNodes, edges: generatedEdges } = generateFlowFromDMMF(dmmf, nodes, layout);

          newNodes = generatedNodes;
          newEdges = generatedEdges;
        }

        state.nodes = newNodes;
        state.edges = newEdges;
      }
    ),
    setEdges: create.reducer((state, action: PayloadAction<Array<TCustomEdge>>) => {
      state.edges = action.payload;
    }),
    setIsFirstSchemaRender: create.reducer((state, action: PayloadAction<boolean>) => {
      state.isFirstSchemaRender = action.payload;
    }),
  }),
  selectors: {
    selectNodes: (editor) => editor.nodes,
    selectEdges: (editor) => editor.edges,
    selectViewport: (editor) => editor.viewport,
    selectIsFirstSchemaRender: (editor) => editor.isFirstSchemaRender,
  },
});

export const { setViewport, setNodes, setEdges, rearrangeNodes, setIsFirstSchemaRender } = flowViewSlice.actions;
export const { selectNodes, selectEdges, selectViewport, selectIsFirstSchemaRender } = flowViewSlice.selectors;
