import { CopyButton } from './CopyButton';
import { DownloadFileButton } from './DownloadFileButton';
import { EditorView } from './EditorView';

interface ISchemaEditorProps {
  sourceText: string | null;
  handleSetSourceText: (text: string) => void;
  isSchemaValidationResultLoading: null | boolean;
  handleFormatSource: () => void;
}

export default function SchemaEditor({
  sourceText,
  handleSetSourceText,
  isSchemaValidationResultLoading,
  handleFormatSource,
}: ISchemaEditorProps) {
  return (
    <section className="relative flex flex-col items-start border-r-2">
      <EditorView
        value={sourceText ?? ''}
        onChange={(val) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          handleSetSourceText(val!);
        }}
      />

      <div className="absolute flex gap-2 left-4 bottom-4">
        <CopyButton input={sourceText ?? ''} />
        <DownloadFileButton sourceText={sourceText ?? ''} />
        <button type="button" className="button floating" onClick={handleFormatSource}>
          Format
        </button>
      </div>

      {isSchemaValidationResultLoading ? (
        <div className="absolute w-4 h-4 border-2 border-b-0 border-l-0 border-blue-500 rounded-full right-4 bottom-4 animate-spin" />
      ) : null}
    </section>
  );
}
