'use client';

import { ReactFlowProvider } from '@xyflow/react';

import { EditorPageLayout } from './EditorPageLayout';
import { selectIsEditorOpened } from '@/app/features/editor/editorSlice';
import { useAppSelector } from '@/app/hooks';
import SchemaEditor from '@/widgets/schema-editor';
import { FlowView } from '@/widgets/schema-viewer/';

export default function MainPage() {
  const isEditorOpened = useAppSelector(selectIsEditorOpened);

  return (
    <EditorPageLayout>
      <div style={{ display: 'flex', height: '100%', paddingTop: '50px' }}>
        {isEditorOpened && <SchemaEditor />}
        <ReactFlowProvider>
          <FlowView />
        </ReactFlowProvider>
      </div>
    </EditorPageLayout>
  );
}
