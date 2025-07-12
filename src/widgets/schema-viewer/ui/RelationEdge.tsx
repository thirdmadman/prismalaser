import { memo } from 'react';
import {
  EdgeText,
  // getEdgeCenter,
  getSmoothStepPath,
} from 'reactflow';

import type { EdgeProps } from 'reactflow';
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
}: EdgeProps<IRelationEdgeData>) => {
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

  // TODO: markers look weird when the edge needs to rotate perpendicular to the
  // start or end. Maybe need to edit `getSmoothStepPath` so it adds some sort
  // of padding at start and end to make it look nicer?
  return (
    <>
      <path
        className="text-gray-400 stroke-current stroke-2 fill-none"
        d={path}
        markerStart={markerStart}
        markerEnd={markerEnd}
      />
      {text}
    </>
  );
};

export default memo(RelationEdge);
