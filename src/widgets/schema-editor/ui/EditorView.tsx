import { useEffect } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';

import { config, language } from '@/shared/lib/monacoPrismaLanguage';

interface IEditorViewProps {
  value: string;
  onChange: (text?: string) => void;
}

export function EditorView({ value, onChange }: IEditorViewProps) {
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.languages.register({ id: 'prisma' });
      monaco.languages.setLanguageConfiguration('prisma', config);
      monaco.languages.setMonarchTokensProvider('prisma', language);
    }
  }, [monaco]);

  return (
    <>
      <div className="w-full h-8 px-4 py-1 text-sm shadow-md text-gray-400">prisma.schema</div>
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
        onChange={onChange}
      />
    </>
  );
}
