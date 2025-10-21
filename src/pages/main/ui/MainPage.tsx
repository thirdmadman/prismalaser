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
      <div className="flex h-full pt-17 xl:pt-13 flex-wrap xl:flex-nowrap">
        {isEditorOpened && <SchemaEditor />}
        <ReactFlowProvider>
          <FlowView />
        </ReactFlowProvider>
      </div>
    </EditorPageLayout>
  );
}
