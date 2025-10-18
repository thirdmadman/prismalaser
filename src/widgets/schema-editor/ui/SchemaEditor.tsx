'use client';

import { useEffect } from 'react';
import closeIcon from '@iconify/icons-gg/close-o';
import { Icon } from '@iconify/react';
import LZString from 'lz-string';
import { useLocalStorage } from 'react-use';

import { EditorView } from './EditorView';
import { selectStatus, selectText, setText } from '@/app/features/editor/editorSlice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { INITIAL_PLACEHOLDER_SCHEMA } from '@/shared/config';

export default function SchemaEditor() {
  const [storedText] = useLocalStorage<string>('Prismalaser.schemaCompressed', INITIAL_PLACEHOLDER_SCHEMA, {
    raw: true,
  });
  const dispatch = useAppDispatch();
  const sourceText = useAppSelector(selectText);
  const status = useAppSelector(selectStatus);

  useEffect(() => {
    let decompressedString = null;
    if (storedText !== INITIAL_PLACEHOLDER_SCHEMA && !!storedText) {
      decompressedString = LZString.decompress(storedText);
    }

    dispatch(setText(decompressedString ?? storedText ?? ''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Populate state from a shared link if one is present
    const params = new URLSearchParams(location.search);

    if (params.has('data')) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const data = params.get('data')!;
      const decompressed = LZString.decompressFromEncodedURIComponent(data);

      dispatch(setText(decompressed));
    }
  }, [dispatch]);

  return (
    <section className="relative flex flex-col items-start border-r-2 bg-neutral-100 dark:bg-neutral-800 dark:text-gray-400 xl:max-w-128 w-full max-h-screen xl:max-h-full">
      <EditorView value={sourceText} />

      {status === 'failed' && (
        <div className="absolute right-4 bottom-4 w-8 h-8">
          <Icon icon={closeIcon} color="#FF0000" width={32} height={32} />
        </div>
      )}

      {status === 'loading' ? (
        <div className="absolute w-8 h-8 border-2 border-b-0 border-l-0 border-blue-500 rounded-full right-4 bottom-4 animate-spin" />
      ) : null}
    </section>
  );
}
