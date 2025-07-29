import { useEffect } from 'react';
import doubleChevronLeft from '@iconify/icons-gg/chevron-double-left';
import doubleChevronRight from '@iconify/icons-gg/chevron-double-right';
import listTree from '@iconify/icons-gg/list-tree';
import { Icon } from '@iconify/react';
import ReactFlow, { Background, BackgroundVariant, ControlButton, Controls, applyNodeChanges } from 'reactflow';

import DownloadButton from './DownloadButton';
import EnumNode from './EnumNode';
import Markers from './Markers';
import ModelNode from './ModelNode';
import RelationEdge from './RelationEdge';
import { updateSchemaStringByChanges } from '../lib/updateSchemaStringByChanges';
import type { ElkNode } from 'elkjs/lib/elk.bundled';
import type { OnNodesChange } from 'reactflow';
import {
  selectDmmf,
  selectIsEditorOpened,
  selectText,
  setIsEditorOpened,
  setText,
} from '@/app/features/editor/editorSlice';
import { selectEdges, selectNodes, setEdges, setNodes } from '@/app/features/flowView/flowViewSlice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { getElkLayout } from '@/shared/lib/layout';
import { generateFlowFromDMMF } from '@/shared/lib/prismaToFlow';
import type { DMMFToElementsResult, TCustomNodeData } from '@/shared/lib/types';

import styles from './FlowView.module.css';

const nodeTypes = {
  model: ModelNode,
  enum: EnumNode,
};

const edgeTypes = {
  relation: RelationEdge,
};

export function FlowView() {
  const dispatch = useAppDispatch();
  const nodes = useAppSelector(selectNodes);
  const edges = useAppSelector(selectEdges);
  const schemaText = useAppSelector(selectText);
  const dmmf = useAppSelector(selectDmmf);
  const isEditorOpened = useAppSelector(selectIsEditorOpened);

  const rearrangeNodes = (layout: ElkNode | null) => {
    const { nodes: newNodes, edges: newEdges }: DMMFToElementsResult = dmmf
      ? generateFlowFromDMMF(dmmf, nodes, layout)
      : { nodes: [], edges: [] };

    // See if `applyNodeChanges` can work here?
    dispatch(setNodes(newNodes));
    dispatch(setEdges(newEdges));
  };

  const disperseLayout = async () => {
    const layout = await getElkLayout(nodes, edges);
    console.log(layout);
    rearrangeNodes(layout);
  };

  const onNodesChange: OnNodesChange = (changes) => {
    const newSchemaString = updateSchemaStringByChanges(schemaText, changes);
    dispatch(setText(newSchemaString));

    dispatch(setNodes(applyNodeChanges<TCustomNodeData>(changes, nodes)));
  };

  useEffect(() => {
    rearrangeNodes(null);
  }, [dmmf]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Markers />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        minZoom={0.05}
        style={{ gridArea: 'flow' }}
        onNodesChange={onNodesChange}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={2} color="currentColor" className="text-gray-200" />
        <Controls>
          <ControlButton title="Disperse nodes" onClick={disperseLayout}>
            <Icon icon={listTree} />
          </ControlButton>
          <DownloadButton />
        </Controls>

        <Controls position="top-left" showZoom={false} showFitView={false} showInteractive={false}>
          <ControlButton
            className={styles.noShrinkIcon}
            title={isEditorOpened ? 'Hide editor' : 'Show editor'}
            onClick={() => dispatch(setIsEditorOpened(!isEditorOpened))}
          >
            <Icon icon={isEditorOpened ? doubleChevronLeft : doubleChevronRight} height={24} width={24} />
          </ControlButton>
        </Controls>
      </ReactFlow>
    </>
  );
}
