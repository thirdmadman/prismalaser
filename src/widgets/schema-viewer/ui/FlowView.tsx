import doubleChevron from '@iconify/icons-gg/chevron-double-left';
import listTree from '@iconify/icons-gg/list-tree';
import { Icon } from '@iconify/react';
import { ElkNode } from 'elkjs/lib/elk.bundled';
import { useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  ControlButton,
  Controls,
  OnNodesChange,
  applyNodeChanges,
} from 'reactflow';

import DownloadButton from './DownloadButton';
import styles from './FlowView.module.css';

import EnumNode from '@/widgets/schema-viewer/ui/EnumNode';
import ModelNode from '@/widgets/schema-viewer/ui/ModelNode';
import RelationEdge from '@/widgets/schema-viewer/ui/RelationEdge';
import { getLayout } from '@/shared/lib/layout';
import { generateFlowFromDMMF } from '@/shared/lib/prismaToFlow';
import { DMMFToElementsResult } from '@/shared/lib/types';

import type { DMMF } from '@prisma/generator-helper';

const nodeTypes = {
  model: ModelNode,
  enum: EnumNode,
};

const edgeTypes = {
  relation: RelationEdge,
};

export interface FlowViewProps {
  dmmf: DMMF.Datamodel | null;
  toggleEditor(): void;
}

// eslint-disable-next-line @typescript-eslint/unbound-method
export function FlowView({ dmmf, toggleEditor }: FlowViewProps) {
  const [nodes, setNodes] = useState<DMMFToElementsResult['nodes']>([]);
  const [edges, setEdges] = useState<DMMFToElementsResult['edges']>([]);

  const regenerateNodes = (layout: ElkNode | null) => {
    const { nodes: newNodes, edges: newEdges } = dmmf
      ? generateFlowFromDMMF(dmmf, nodes, layout)
      : ({ nodes: [], edges: [] } as DMMFToElementsResult);

    // See if `applyNodeChanges` can work here?
    setNodes(newNodes);
    setEdges(newEdges);
  };

  const refreshLayout = async () => {
    const layout = await getLayout(nodes, edges);
    regenerateNodes(layout);
  };

  const onNodesChange: OnNodesChange = (changes) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    setNodes((nodes) => applyNodeChanges(changes, nodes as any) as any);
  };

  useEffect(() => {
    regenerateNodes(null);
  }, [dmmf]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
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
          <ControlButton title="Disperse nodes" onClick={refreshLayout}>
            <Icon icon={listTree} />
          </ControlButton>
          <DownloadButton />
        </Controls>

        <Controls position="top-left" showZoom={false} showFitView={false} showInteractive={false}>
          <ControlButton className={styles.noShrinkIcon} title="Hide editor" onClick={toggleEditor}>
            <Icon icon={doubleChevron} height={24} width={24} />
          </ControlButton>
        </Controls>
      </ReactFlow>

      <svg width="0" height="0">
        <defs>
          <marker
            id="prismaliser-one"
            markerWidth="12.5"
            markerHeight="12.5"
            viewBox="-10 -10 20 20"
            orient="auto-start-reverse"
            refX="0"
            refY="0"
          >
            <polyline
              className="text-gray-400 stroke-current"
              strokeWidth="3"
              strokeLinecap="square"
              fill="none"
              points="-10,-8 -10,8"
            />
          </marker>

          <marker
            id="prismaliser-many"
            markerWidth="12.5"
            markerHeight="12.5"
            viewBox="-10 -10 20 20"
            orient="auto-start-reverse"
            refX="0"
            refY="0"
          >
            <polyline
              className="text-gray-400 stroke-current"
              strokeLinejoin="round"
              strokeLinecap="square"
              strokeWidth="1.5"
              fill="none"
              points="0,-8 -10,0 0,8"
            />
          </marker>
        </defs>
      </svg>
    </>
  );
}
