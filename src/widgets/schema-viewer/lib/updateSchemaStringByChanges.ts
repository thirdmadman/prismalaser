import type { NodeChange } from 'reactflow';

export function updateSchemaStringByChanges(sourceSchemaString: string, changes: Array<NodeChange> | null | undefined) {
  let result = sourceSchemaString;

  if (!sourceSchemaString) {
    return result;
  }

  if (!changes || changes.length === 0) {
    return result;
  }

  const schemaChangesToImplement = changes.filter((el) => el.type === 'position' && el.id !== '');

  if (schemaChangesToImplement.length === 0) {
    return result;
  }

  schemaChangesToImplement.forEach((el) => {
    if (el.type !== 'position') {
      return;
    }

    const { id, position } = el;

    if (!position?.x || !position.y) {
      return;
    }

    const modelNodeStart = result.indexOf(`model ${id}`);
    const enumNodeStart = result.indexOf(`enum ${id}`);

    let schemaNodeStart = modelNodeStart;

    if (modelNodeStart < 0) {
      schemaNodeStart = enumNodeStart;
    }

    // console.log(result.substring(0, schemaNodeStart));
    if (schemaNodeStart === -1) {
      return;
    }
    const modelNodeCommentStarts = result.lastIndexOf('///', schemaNodeStart);
    // console.log(result.substring(modelNodeCommentStarts));

    if (modelNodeCommentStarts === -1) {
      return;
    }

    const endOfCommentLine = result.indexOf('\n', modelNodeCommentStarts);
    // console.log(result.substring(0, endOfCommentLine));

    const commentString = result.substring(modelNodeCommentStarts, endOfCommentLine);

    const POSITION_START_TAG = `@Prismalaser.position(`;
    const POSITION_END_TAG = `)`;

    const startOfPositionJsonRelative = commentString.lastIndexOf(POSITION_START_TAG);

    if (startOfPositionJsonRelative < 0) {
      return;
    }

    const endOfPositionJsonRelative = commentString.indexOf(POSITION_END_TAG, startOfPositionJsonRelative);

    const positionString = `(x:${String(position.x)}, y:${String(position.y)})`;

    const leftPart = result.substring(
      0,
      modelNodeCommentStarts + POSITION_START_TAG.length + startOfPositionJsonRelative - 1
    );
    const rightPart = result.substring(modelNodeCommentStarts + endOfPositionJsonRelative + POSITION_END_TAG.length);

    result = `${leftPart}${positionString}${rightPart}`;
  });

  return result;
}
