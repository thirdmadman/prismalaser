import { config, language } from '@/shared/lib/monacoPrismaLanguage';
import Editor, { useMonaco } from '@monaco-editor/react';
import React, { useEffect } from 'react';



export interface EditorViewProps {
  value: string;
  onChange: (text?: string) => void;
}

export function EditorView({ value, onChange }: EditorViewProps) {
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.languages.register({ id: 'prisma' });
      monaco.languages.setLanguageConfiguration('prisma', config);
      monaco.languages.setMonarchTokensProvider('prisma', language);
    }
  }, [monaco]);

  return (
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
  );
}
