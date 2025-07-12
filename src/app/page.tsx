'use client';

import { useEffect, useState } from 'react';
import { useMonaco } from '@monaco-editor/react';
import { useDebounce, useLocalStorage } from 'react-use';

import type { DMMF } from '@prisma/generator-helper';
import type { editor } from 'monaco-editor';
import { INITIAL_PLACEHOLDER_SCHEMA } from '@/shared/config';
import { fromUrlSafeB64 } from '@/shared/lib';
import type { ISchemaError } from '@/shared/lib/types';
import { Layout } from '@/shared/ui';
import { CopyButton, EditorView } from '@/widgets/schema-editor/';
import { FlowView } from '@/widgets/schema-viewer/';

interface ISchemaValidationResult {
  isOk?: boolean;
  isLoading?: boolean;
  errors?: Array<ISchemaError>;
}

export default function IndexPage() {
  // TODO: multiple save states.
  const [storedText, setStoredText] = useLocalStorage('prismalaser.text', INITIAL_PLACEHOLDER_SCHEMA);
  const [text, setText] = useState(storedText ?? null);
  const [schemaErrors, setSchemaErrors] = useState<Array<ISchemaError>>([]);
  const [dmmf, setDMMF] = useState<DMMF.Datamodel | null>(null);
  const [editorVisible, setEditorVisible] = useState(true);
  const [schemaValidationResult, setSchemaValidationResult] = useState<ISchemaValidationResult | null>(null);

  const monaco = useMonaco();

  const submit = async () => {
    setStoredText(text ?? '');
    setSchemaValidationResult({ isLoading: true });
    const response = await fetch('api/validate', { method: 'POST', body: JSON.stringify({ text }) });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const responseData = await response.json();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (responseData.isOk) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      const data = JSON.parse(responseData.data);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      setDMMF(data);
      setSchemaErrors([]);
      setSchemaValidationResult({ isLoading: false, isOk: true });
    } else {
      console.error(response);
      setSchemaValidationResult({ isLoading: false, isOk: false });
    }
  };

  const format = async () => {
    const response = await fetch('api/format', { method: 'POST', body: JSON.stringify({ text }) });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const responseData = await response.json();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (responseData.isOk) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      setText(responseData.data);
    }
  };

  useDebounce(submit, 1000, [text]);

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

  useEffect(() => {
    // Populate state from a shared link if one is present
    const params = new URLSearchParams(location.search);

    if (params.has('code')) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const code = params.get('code')!;
      const decoded = fromUrlSafeB64(code);

      setText(decoded);
    }
  }, []);

  const toggleEditor = () => {
    setEditorVisible((v) => !v);
  };

  return (
    <Layout noEditor={!editorVisible}>
      {}
      {editorVisible && (
        <section className="relative flex flex-col items-start border-r-2">
          <EditorView
            value={text ?? ''}
            onChange={(val) => {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              setText(val!);
            }}
          />

          <div className="absolute flex gap-2 left-4 bottom-4">
            <CopyButton input={text ?? ''} />

            <button type="button" className="button floating" onClick={format}>
              Format
            </button>
          </div>

          {schemaValidationResult?.isLoading ? (
            <div className="absolute w-4 h-4 border-2 border-b-0 border-l-0 border-blue-500 rounded-full right-4 bottom-4 animate-spin" />
          ) : null}
        </section>
      )}
      <FlowView
        dmmf={dmmf}
        toggleEditor={toggleEditor}
        schemaText={text ?? ''}
        onTextChange={(text) => {
          setText(text ?? null);
        }}
      />
    </Layout>
  );
}
