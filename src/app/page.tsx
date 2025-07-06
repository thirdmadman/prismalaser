'use client';

import { useMonaco } from '@monaco-editor/react';
import React, { useEffect, useState } from 'react';
import { useDebounce, useLocalStorage } from 'react-use';

import { EditorView } from '@/widgets/schema-editor/';
import { FlowView } from '@/widgets/schema-viewer/';
import Layout from '@/shared/ui/page-layout/Layout';
import { fromUrlSafeB64 } from '@/shared/lib';
import { SchemaError } from '@/shared/lib/types';

import type { DMMF } from '@prisma/generator-helper';
import type { editor } from 'monaco-editor';
import { INITIAL_PLACEHOLDER_SCHEMA } from '@/shared/config';
import CopyButton from '@/widgets/schema-editor/ui/CopyButton';

interface ISchemaValidationResult {
  isOk?: boolean;
  isLoading?: boolean;
  errors?: SchemaError[];
}

export default function IndexPage() {
  // TODO: multiple save states.
  const [storedText, setStoredText] = useLocalStorage('prismaliser.text', INITIAL_PLACEHOLDER_SCHEMA);
  const [text, setText] = useState(storedText!);
  const [schemaErrors, setSchemaErrors] = useState<SchemaError[]>([]);
  const [dmmf, setDMMF] = useState<DMMF.Datamodel | null>(null);
  const [editorVisible, setEditorVisible] = useState(true);
  const [schemaValidationResult, setSchemaValidationResult] = useState<ISchemaValidationResult | null>(null);

  const monaco = useMonaco();

  const submit = async () => {
    setStoredText(text);
    setSchemaValidationResult({ isLoading: true });
    const response = await fetch('api/validate', { method: 'POST', body: JSON.stringify({ text }) });
    const responseData = await response.json();

    if (responseData.isOk) {
      const data = JSON.parse(responseData.data);
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
    const responseData = await response.json();

    if (responseData.isOk) {
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

    monaco.editor.setModelMarkers(model!, 'prismaliser', markers);
  }, [monaco, schemaErrors]);

  useEffect(() => {
    // Populate state from a shared link if one is present
    const params = new URLSearchParams(location.search);

    if (params.has('code')) {
      const code = params.get('code')!;
      const decoded = fromUrlSafeB64(code);

      setText(decoded);
    }
  }, []);

  const toggleEditor = () => setEditorVisible((v) => !v);

  return (
    <Layout noEditor={!editorVisible}>
      {}
      {editorVisible && (
        <section className="relative flex flex-col items-start border-r-2">
          <EditorView value={text} onChange={(val) => setText(val!)} />

          <div className="absolute flex gap-2 left-4 bottom-4">
            <CopyButton input={text} />

            <button type="button" className="button floating" onClick={format}>
              Format
            </button>
          </div>

          {schemaValidationResult?.isLoading ? (
            <div className="absolute w-4 h-4 border-2 border-b-0 border-l-0 border-blue-500 rounded-full right-4 bottom-4 animate-spin" />
          ) : null}
        </section>
      )}
      <FlowView dmmf={dmmf} toggleEditor={toggleEditor} />
    </Layout>
  );
}
