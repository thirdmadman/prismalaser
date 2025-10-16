import {
  clearStoredData,
  formatSchemaAsync,
  insertPositionComments,
  selectText,
} from '@/app/features/editor/editorSlice';
import { selectNodes } from '@/app/features/flowView/flowViewSlice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { copyUrlToClipboard } from '@/shared/lib/copyUrlToClipboard';
import { downloadTextAsFile } from '@/shared/lib/downloadTextAsFile';

export default function FilePanel() {
  const text = useAppSelector(selectText);
  const nodes = useAppSelector(selectNodes);
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col gap-2 text-sm">
      <button
        className="block px-2 py-1 rounded hover:bg-neutral-300 dark:hover:bg-neutral-600 transition text-left"
        onClick={() => dispatch(formatSchemaAsync(text))}
      >
        Format
      </button>
      <button
        className="block px-2 py-1 rounded hover:bg-neutral-300 dark:hover:bg-neutral-600 transition text-left"
        onClick={() => {
          downloadTextAsFile(text);
        }}
      >
        Download Schema
      </button>
      <button
        className="block px-2 py-1 rounded hover:bg-neutral-300 dark:hover:bg-neutral-600 transition text-left"
        onClick={async () => {
          await copyUrlToClipboard(text);
        }}
      >
        Copy link
      </button>
      <button
        className="block px-2 py-1 rounded hover:bg-neutral-300 dark:hover:bg-neutral-600 transition text-left"
        onClick={() => {
          dispatch(clearStoredData());
        }}
      >
        Delete stored data
      </button>
      <button
        className="block px-2 py-1 rounded hover:bg-neutral-300 dark:hover:bg-neutral-600 transition text-left"
        onClick={() => {
          dispatch(insertPositionComments(nodes));
        }}
      >
        Add position comments
      </button>
    </div>
  );
}
