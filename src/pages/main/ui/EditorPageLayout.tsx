import type React from 'react';

import EditorTopMenu from '../../../widgets/editor-top-menu/ui/EditorTopMenu';

interface IEditorPageLayoutProps {
  children: React.ReactNode;
}

export function EditorPageLayout({ children }: IEditorPageLayoutProps) {
  return (
    <main className="relative xl:h-screen w-screen">
      <EditorTopMenu />
      {children}
    </main>
  );
}
