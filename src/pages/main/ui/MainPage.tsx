'use client';

import { useEffect } from 'react';
import { useMonaco } from '@monaco-editor/react';
import { ReactFlowProvider } from 'reactflow';

import type { editor } from 'monaco-editor';
import { selectIsEditorOpened, selectSchemaErrors } from '@/app/features/editor/editorSlice';
import { useAppSelector } from '@/app/hooks';
import { Layout } from '@/shared/ui';
import SchemaEditor from '@/widgets/schema-editor';
import { FlowView } from '@/widgets/schema-viewer/';

export default function MainPage() {
  const schemaErrors = useAppSelector(selectSchemaErrors);
  const isEditorOpened = useAppSelector(selectIsEditorOpened);
  const monaco = useMonaco();

  useEffect(() => {
    // Set error squiggles in the editor if we have any
    if (!monaco) return;

    const markers = schemaErrors.map<editor.IMarkerData>((err) => ({
      message: err.reason,
      startLineNumber: Number(err.row),
      endLineNumber: Number(err.row),
      startColumn: 0,
      endColumn: 9999,
      severity: 8,
    }));
    const [model] = monaco.editor.getModels();

    monaco.editor.setModelMarkers(model, 'prismalaser', markers);
  }, [monaco, schemaErrors]);

  return (
    <Layout noEditor={!isEditorOpened}>
      {isEditorOpened && <SchemaEditor />}
      <ReactFlowProvider>
        <FlowView />
      </ReactFlowProvider>
    </Layout>
  );
}
