import { useEffect, useState } from 'react';
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
import type { DMMF } from '@prisma/generator-helper';
import type { NodeChange } from 'reactflow';
import {
  selectDmmf,
  selectIsEditorOpened,
  selectText,
  setIsEditorOpened,
  setText,
} from '@/app/features/editor/editorSlice';
import { rearrangeNodes, selectEdges, selectNodes, setNodes } from '@/app/features/flowView/flowViewSlice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { getElkLayout } from '@/shared/lib/layout';
import type { TCustomEdge, TCustomNode, TCustomNodeData } from '@/shared/lib/types';

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
  const [viewChanges, setViewChanges] = useState<{ changes: Array<NodeChange>; isStopped: boolean }>({
    changes: [],
    isStopped: true,
  });

  const disperseLayout = async (dmmf: DMMF.Datamodel | null, nodes: Array<TCustomNode>, edges: Array<TCustomEdge>) => {
    const layout = await getElkLayout(nodes, edges);

    dispatch(rearrangeNodes({ dmmf, layout }));
  };

  const onNodesChangeAction = (changes: Array<NodeChange>, nodes: Array<TCustomNode>, schemaText: string) => {
    const filteredChangesOnlyPosition = changes.filter((el) => el.type === 'position');
    if (filteredChangesOnlyPosition.length === 0) {
      return;
    }

    let isFinished = false;

    const isFinishedDragging = filteredChangesOnlyPosition.filter((el) => el.dragging === false);

    if (isFinishedDragging.length === 0) {
      setViewChanges((state) => ({
        changes: [...state.changes, ...filteredChangesOnlyPosition],
        isStopped: isFinished,
      }));
      dispatch(setNodes(applyNodeChanges<TCustomNodeData>(viewChanges.changes, nodes)));
      return;
    }

    isFinished = true;

    const accumulatedChanges = [...viewChanges.changes, ...filteredChangesOnlyPosition];

    setViewChanges({
      changes: [],
      isStopped: true,
    });

    const newSchemaString = updateSchemaStringByChanges(schemaText, accumulatedChanges);
    dispatch(setText(newSchemaString));
  };

  useEffect(() => {
    dispatch(rearrangeNodes({ dmmf, layout: null }));
  }, [dispatch, dmmf]);

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
        onNodesChange={(changes) => {
          onNodesChangeAction(changes, nodes, schemaText);
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={2} color="currentColor" className="text-gray-200" />
        <Controls>
          <ControlButton title="Disperse nodes" onClick={() => disperseLayout(dmmf, nodes, edges)}>
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
