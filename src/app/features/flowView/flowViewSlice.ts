import type { DMMF } from '@prisma/generator-helper';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ElkNode } from 'elkjs';
import { createAppSlice } from '@/app/createAppSlice';
import { generateFlowFromDMMF } from '@/shared/lib/prismaToFlow';
import type { TCustomEdge, TCustomNode } from '@/shared/lib/types';

export interface IFlowViewSliceSliceState {
  nodes: Array<TCustomNode>;
  edges: Array<TCustomEdge>;
}

const initialState: IFlowViewSliceSliceState = {
  nodes: [],
  edges: [],
};

export const flowViewSlice = createAppSlice({
  name: 'flowView',
  initialState,
  reducers: (create) => ({
    setNodes: create.reducer((state, action: PayloadAction<Array<TCustomNode>>) => {
      state.nodes = action.payload;
    }),
    rearrangeNodes: create.reducer(
      (state, action: PayloadAction<{ dmmf: DMMF.Datamodel | null; layout: ElkNode | null }>) => {
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
  }),
  selectors: {
    selectNodes: (editor) => editor.nodes,
    selectEdges: (editor) => editor.edges,
  },
});

export const { setNodes, setEdges, rearrangeNodes } = flowViewSlice.actions;
export const { selectNodes, selectEdges } = flowViewSlice.selectors;
