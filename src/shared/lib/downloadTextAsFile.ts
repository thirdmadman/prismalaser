import { defaultSchemaFileName } from '../config';

export const downloadTextAsFile = (text: string, fileName: string | null = null) => {
  fileName ??= defaultSchemaFileName;

  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();

  URL.revokeObjectURL(url);
};
