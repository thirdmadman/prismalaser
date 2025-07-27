import { selectText } from '@/app/features/editor/editorSlice';
import { useAppSelector } from '@/app/hooks';
import { downloadTextAsFile } from '@/shared/lib/downloadTextAsFile';

export function DownloadFileButton() {
  const text = useAppSelector(selectText);

  return (
    <button
      type="button"
      className="button floating"
      title="Download file"
      aria-label="Download file"
      onClick={() => {
        downloadTextAsFile(text);
      }}
    >
      Download Schema
    </button>
  );
}
