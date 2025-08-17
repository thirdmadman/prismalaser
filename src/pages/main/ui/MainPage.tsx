'use client';

import { ReactFlowProvider } from 'reactflow';

import { selectIsEditorOpened } from '@/app/features/editor/editorSlice';
import { useAppSelector } from '@/app/hooks';
import { Layout } from '@/shared/ui';
import SchemaEditor from '@/widgets/schema-editor';
import { FlowView } from '@/widgets/schema-viewer/';

export default function MainPage() {
  const isEditorOpened = useAppSelector(selectIsEditorOpened);

  return (
    <Layout noEditor={!isEditorOpened}>
      {isEditorOpened && <SchemaEditor />}
      <ReactFlowProvider>
        <FlowView />
      </ReactFlowProvider>
    </Layout>
  );
}
