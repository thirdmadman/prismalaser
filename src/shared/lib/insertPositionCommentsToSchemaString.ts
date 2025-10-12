import { extractNodePositionDataFromCommentString } from './extractNodePositionDataFromCommentString';
import type { TCustomNode } from '@/shared/lib/types';

const getIntervalBetweenNodeAndPreviousNode = (schemaString: string, nodeId: string) => {
  const modelNodeStart = schemaString.indexOf(`model ${nodeId}`);
  const enumNodeStart = schemaString.indexOf(`enum ${nodeId}`);

  let schemaNodeStartIndex = modelNodeStart;

  if (modelNodeStart < 0) {
    schemaNodeStartIndex = enumNodeStart;
  }

  if (schemaNodeStartIndex === -1) {
    return null;
  }

  let previousNodeEndIndex = schemaString.lastIndexOf('}', schemaNodeStartIndex);

  if (previousNodeEndIndex === -1) {
    previousNodeEndIndex = 0;
  }

  return { previousNodeEndIndex: previousNodeEndIndex + 1, currentNodeStartIndex: schemaNodeStartIndex };
};

export function insertPositionCommentsToSchemaString(schemaString: string, nodes: Array<TCustomNode>) {
  if (!schemaString || schemaString.length < 2) {
    return null;
  }

  const nodesNeedsToBeHandled = nodes.filter((node) => {
    const nodeId = node.id;
    const interval = getIntervalBetweenNodeAndPreviousNode(schemaString, nodeId);
    const stringBetweenNodes = schemaString.substring(
      interval?.previousNodeEndIndex ?? 0,
      interval?.currentNodeStartIndex
    );

    const extractedPosition = extractNodePositionDataFromCommentString(stringBetweenNodes);

    if (extractedPosition) {
      return false;
    }

    return true;
  });

  const resultText = nodesNeedsToBeHandled.reduce((acc, current) => {
    const nodeId = current.id;
    const interval = getIntervalBetweenNodeAndPreviousNode(acc, nodeId);
    if (!interval) {
      return acc;
    }

    const middleCutIndex = acc.lastIndexOf('\n', interval.currentNodeStartIndex + 1);

    const leftPart = acc.substring(0, middleCutIndex);
    const rightPart = acc.substring(middleCutIndex);

    const positionComment = `\n/// @Prismalaser.position(x:${String(current.position.x)}, y:${String(current.position.y)})`;
    const result = `${leftPart}${positionComment}${rightPart}`;
    return result;
  }, schemaString);

  return resultText;
}
