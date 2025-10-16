import { memo } from 'react';
import { EdgeText, getSmoothStepPath } from '@xyflow/react';

import type { Edge, EdgeProps } from '@xyflow/react';
import type { IRelationEdgeData } from '@/shared/lib/types';

const RelationEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  labelStyle,
  labelShowBg,
  labelBgBorderRadius,
  labelBgPadding,
  labelBgStyle,
  data,
}: EdgeProps<Edge<IRelationEdgeData>>) => {
  const [path, centerX, centerY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 8,
  });

  const text = label ? (
    <EdgeText
      x={centerX}
      y={centerY}
      label={label}
      labelStyle={labelStyle}
      labelShowBg={labelShowBg}
      labelBgStyle={labelBgStyle}
      labelBgPadding={labelBgPadding}
      labelBgBorderRadius={labelBgBorderRadius}
    />
  ) : null;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { relationType } = data!;
  const [markerStart, markerEnd] = {
    'm-n': ['url(#schema-maker-many)', 'url(#schema-maker-many)'],
    '1-n': ['url(#schema-maker-many)', 'url(#schema-maker-one)'],
    '1-1': ['url(#schema-maker-one)', 'url(#schema-maker-one)'],
  }[relationType];

  return (
    <>
      <path
        d={path}
        fill="none"
        className="react-flow__edge-path stroke-red-500"
        markerStart={markerStart}
        markerEnd={markerEnd}
      ></path>
      <path d={path} fill="none" strokeOpacity="0" strokeWidth="20" className="react-flow__edge-interaction"></path>
      {text}
    </>
  );
};

export default memo(RelationEdge);
