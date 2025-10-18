import { useEffect, useState } from 'react';
import doubleChevronLeft from '@iconify/icons-gg/chevron-double-left';
import doubleChevronRight from '@iconify/icons-gg/chevron-double-right';
import listTree from '@iconify/icons-gg/list-tree';
import { Icon } from '@iconify/react';
import {
  Background,
  BackgroundVariant,
  ControlButton,
  Controls,
  type Node,
  type NodeChange,
  ReactFlow,
  type Viewport,
  applyNodeChanges,
  useNodesInitialized,
  useOnViewportChange,
  useReactFlow,
} from '@xyflow/react';
import cc from 'classcat';
import { useDebounce } from 'react-use';

import DownloadButton from './DownloadButton';
import EnumNode from './EnumNode';
import Markers from './Markers';
import ModelNode from './ModelNode';
import RelationEdge from './RelationEdge';
import { updateSchemaStringByChanges } from '../lib/updateSchemaStringByChanges';
import type { DMMF } from '@prisma/generator-helper';
import { selectTheme } from '@/app/features/configs/configsSlice';
import {
  selectDmmf,
  selectIsEditorOpened,
  selectText,
  setIsEditorOpened,
  setText,
} from '@/app/features/editor/editorSlice';
import {
  rearrangeNodes,
  selectEdges,
  selectIsSetFitViewNeeded,
  selectNodes,
  setIsFirstSchemaRender,
  setIsSetFitViewNeeded,
  setNodes,
  setViewport,
} from '@/app/features/flowView/flowViewSlice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { getElkLayout } from '@/shared/lib/layout';
import type { TCustomEdge, TCustomNode, TCustomNodeData } from '@/shared/lib/types';
import { useMediaQuery } from '@/shared/lib/useMediaQuery';

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
  const isSetFitViewNeeded = useAppSelector(selectIsSetFitViewNeeded);
  const { fitView } = useReactFlow();
  const isEditorOpened = useAppSelector(selectIsEditorOpened);
  const nodesInitialized = useNodesInitialized();
  const [viewChanges, setViewChanges] = useState<{ changes: Array<NodeChange>; isStopped: boolean }>({
    changes: [],
    isStopped: true,
  });
  const [viewportState, setViewportState] = useState<Viewport>({ x: 0, y: 0, zoom: 1 });
  const theme = useAppSelector(selectTheme);

  useDebounce(
    () => {
      dispatch(setViewport(viewportState));
    },
    10000,
    [viewportState]
  );

  useEffect(() => {
    dispatch(setIsFirstSchemaRender(false));
    dispatch(setIsSetFitViewNeeded(true));
  }, [dispatch]);

  useEffect(() => {
    if (!nodesInitialized || !isSetFitViewNeeded) {
      return;
    }

    fitView()
      .then(() => dispatch(setIsSetFitViewNeeded(false)))
      .catch((e: unknown) => {
        console.error(e);
      });
  }, [dispatch, fitView, isSetFitViewNeeded, nodesInitialized]);

  useOnViewportChange({
    onChange: (viewport: Viewport) => {
      if (
        Math.floor(viewport.x / 10) === Math.floor(viewportState.x / 10) &&
        Math.floor(viewport.y / 10) === Math.floor(viewportState.y / 10) &&
        Math.floor(viewport.zoom / 10) === Math.floor(viewportState.zoom / 10)
      ) {
        return;
      }
      setViewportState(viewport);
    },
  });

  const isBiggerThanXl = useMediaQuery('(min-width: 80rem)');

  const disperseLayout = async (dmmf: DMMF.Datamodel | null, nodes: Array<TCustomNode>, edges: Array<TCustomEdge>) => {
    const layout = await getElkLayout(nodes, edges);

    dispatch(rearrangeNodes({ dmmf, layout }));
  };

  const onNodesChangeAction = (
    changes: Array<NodeChange<TCustomNode>>,
    nodes: Array<TCustomNode>,
    schemaText: string
  ) => {
    const calculatedChanges = applyNodeChanges<Node<TCustomNodeData>>(changes, nodes);
    dispatch(setNodes(calculatedChanges));
    const filteredChangesOnlyPosition = changes.filter((el) => el.type === 'position');
    if (filteredChangesOnlyPosition.length === 0) {
      return;
    }

    let isFinished = false;

    const isFinishedDragging = filteredChangesOnlyPosition.filter((el) => el.dragging === false);
    const accumulatedChanges = [...viewChanges.changes, ...filteredChangesOnlyPosition];

    if (isFinishedDragging.length === 0) {
      setViewChanges({
        changes: accumulatedChanges,
        isStopped: isFinished,
      });

      return;
    }

    isFinished = true;

    setViewChanges({
      changes: [],
      isStopped: true,
    });

    const newSchemaString = updateSchemaStringByChanges(schemaText, accumulatedChanges);
    dispatch(setText(newSchemaString));
  };

  return (
    <section className={cc([styles.flowViewSection, 'xl:min-h-full'])}>
      <Markers />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        minZoom={0.05}
        snapToGrid={true}
        snapGrid={[10, 10]}
        onNodesChange={(changes) => {
          onNodesChangeAction(changes, nodes, schemaText);
        }}
        colorMode={theme}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={2} color="currentColor" className="text-gray-200" />
        <Controls
          position={isBiggerThanXl ? 'bottom-left' : 'bottom-right'}
          orientation={isBiggerThanXl ? 'vertical' : 'horizontal'}
        >
          <ControlButton title="Disperse nodes" onClick={() => disperseLayout(dmmf, nodes, edges)}>
            <Icon icon={listTree} />
          </ControlButton>
          <DownloadButton />
        </Controls>

        <Controls
          position={isBiggerThanXl ? 'top-left' : 'top-right'}
          showZoom={false}
          showFitView={false}
          showInteractive={false}
        >
          <ControlButton
            className={cc([styles.noShrinkIcon, 'rotate-270 xl:rotate-0'])}
            title={isEditorOpened ? 'Hide editor' : 'Show editor'}
            onClick={() => {
              dispatch(setIsEditorOpened(!isEditorOpened));
              if (!isEditorOpened && !isBiggerThanXl) {
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                });
              }
            }}
          >
            <Icon icon={isEditorOpened ? doubleChevronLeft : doubleChevronRight} height={24} width={24} />
          </ControlButton>
        </Controls>
      </ReactFlow>
    </section>
  );
}
