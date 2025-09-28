export const extractNodePositionDataFromCommentString = (commentString: string) => {
  /// @Prismalaser.position(x: 100, y: -100)

  const positionCommentSignature = '@Prismalaser.position';

  const positionDataCommentStartIndex = commentString.lastIndexOf(positionCommentSignature);
  if (positionDataCommentStartIndex < 0) {
    return null;
  }

  let positionOfNewLine = commentString.indexOf('\n', positionDataCommentStartIndex);
  if (positionOfNewLine < 0) {
    positionOfNewLine = commentString.length;
  }

  let positionDataString = commentString.substring(
    positionDataCommentStartIndex + positionCommentSignature.length,
    positionOfNewLine
  );

  positionDataString = positionDataString.trim().replaceAll(' ', '').replaceAll('\t', '');

  if (positionDataString.length < 9) {
    return null;
  }

  const positionDataStartIndex = positionDataString.indexOf('(');
  const positionDataEndIndex = positionDataString.indexOf(')', positionDataStartIndex + 1);

  if (positionDataStartIndex < 0 || positionDataEndIndex < 0 || positionDataStartIndex > positionDataEndIndex) {
    return null;
  }

  const positionDataXStartIndex = positionDataString.indexOf('x:');
  const positionDataYStartIndex = positionDataString.indexOf('y:');
  const positionDataSeparator = positionDataString.indexOf(',');

  if (positionDataXStartIndex < 0 || positionDataYStartIndex < 0 || positionDataSeparator < 0) {
    return null;
  }

  const isXPositionLeading = positionDataXStartIndex < positionDataYStartIndex;

  let x = NaN;
  let y = NaN;

  if (isXPositionLeading) {
    x = parseInt(positionDataString.substring(positionDataXStartIndex + 2, positionDataSeparator), 10);
    y = parseInt(positionDataString.substring(positionDataYStartIndex + 2, positionDataEndIndex), 10);
  } else {
    x = parseInt(positionDataString.substring(positionDataXStartIndex + 2, positionDataEndIndex), 10);
    y = parseInt(positionDataString.substring(positionDataYStartIndex + 2, positionDataSeparator), 10);
  }

  if (isNaN(x) || isNaN(y)) {
    return null;
  }

  return {
    x,
    y,
  };
};
