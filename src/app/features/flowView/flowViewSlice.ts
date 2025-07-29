import type { PayloadAction } from '@reduxjs/toolkit';
import { createAppSlice } from '@/app/createAppSlice';
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
    setEdges: create.reducer((state, action: PayloadAction<Array<TCustomEdge>>) => {
      state.edges = action.payload;
    }),
  }),
  selectors: {
    selectNodes: (editor) => editor.nodes,
    selectEdges: (editor) => editor.edges,
  },
});

export const { setNodes, setEdges } = flowViewSlice.actions;
export const { selectNodes, selectEdges } = flowViewSlice.selectors;
