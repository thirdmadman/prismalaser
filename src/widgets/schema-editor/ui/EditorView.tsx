import { useEffect, useRef } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';

import type { OnChange, OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { selectFileName, selectSchemaErrors, setText } from '@/app/features/editor/editorSlice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { config, language } from '@/shared/lib/monacoPrismaLanguage';

interface IEditorViewProps {
  value: string;
}

type IStandaloneCodeEditor = Parameters<OnMount>[0];

export function EditorView({ value }: IEditorViewProps) {
  const monaco = useMonaco();
  const fileName = useAppSelector(selectFileName);
  const dispatch = useAppDispatch();
  const editorRef = useRef<IStandaloneCodeEditor | null>(null);

  const schemaErrors = useAppSelector(selectSchemaErrors);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!monaco || !editorRef) {
      return;
    }

    const model = editorRef.current?.getModel();

    if (model) {
      const markers = schemaErrors.map<editor.IMarkerData>((err) => ({
        message: err.reason,
        startLineNumber: Number(err.row),
        endLineNumber: Number(err.row),
        startColumn: 0,
        endColumn: 9999,
        severity: monaco.MarkerSeverity.Error,
      }));
      monaco.editor.setModelMarkers(model, 'prisma-validate', markers);
    }
  }, [monaco, schemaErrors]);

  useEffect(() => {
    if (monaco) {
      monaco.languages.register({ id: 'prisma' });
      monaco.languages.setLanguageConfiguration('prisma', config);
      monaco.languages.setMonarchTokensProvider('prisma', language);
    }
  }, [monaco]);

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleEditorChange: OnChange = (value) => {
    dispatch(setText(value ?? ''));
  };

  return (
    <>
      <div className="w-full h-8 px-4 py-1 text-sm shadow-md text-gray-400">{fileName}</div>
      <Editor
        height="100%"
        language="prisma"
        theme="light"
        loading="Loading..."
        path="schema.prisma"
        options={{
          minimap: { enabled: false },
          smoothScrolling: true,
          cursorSmoothCaretAnimation: 'on',
          scrollBeyondLastLine: true,
        }}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorMount}
      />
    </>
  );
}
