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

    let previousBlockStart = result.lastIndexOf('}', schemaNodeStart);

    if (previousBlockStart === -1) {
      previousBlockStart = 0;
    }

    const modelNodeCommentStarts = result.indexOf('///', previousBlockStart);

    if (modelNodeCommentStarts === -1 || modelNodeCommentStarts > schemaNodeStart) {
      return;
    }

    const endOfCommentIndex = result.lastIndexOf('\n', schemaNodeStart);

    const commentString = result.substring(modelNodeCommentStarts, endOfCommentIndex);

    const EXTRACTION_START_TAG = `@Prismalaser.position(`;
    const EXTRACTION_END_TAG = `)`;

    const extractionStartTagStartPositionIndexRelative = commentString.lastIndexOf(EXTRACTION_START_TAG);

    if (extractionStartTagStartPositionIndexRelative < 0) {
      return;
    }

    const controlNewLine = commentString.indexOf('\n', extractionStartTagStartPositionIndexRelative);

    const extractionEndTagStartPositionIndexRelative = commentString.indexOf(
      EXTRACTION_END_TAG,
      extractionStartTagStartPositionIndexRelative
    );

    if (controlNewLine > 0 && extractionEndTagStartPositionIndexRelative > controlNewLine) {
      console.error('Prismalaser comment parsing error: no end tag ")"');
      return;
    }

    const positionString = `x:${String(position.x)}, y:${String(position.y)}`;

    const leftPart = result.substring(
      0,
      modelNodeCommentStarts + EXTRACTION_START_TAG.length + extractionStartTagStartPositionIndexRelative
    );
    const rightPart = result.substring(modelNodeCommentStarts + extractionEndTagStartPositionIndexRelative);

    result = `${leftPart}${positionString}${rightPart}`;
  });

  return result;
}
