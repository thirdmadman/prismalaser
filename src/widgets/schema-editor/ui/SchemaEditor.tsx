'use client';

import { useEffect } from 'react';
import closeIcon from '@iconify/icons-gg/close-o';
import { Icon } from '@iconify/react';
import { useLocalStorage } from 'react-use';

import { EditorView } from './EditorView';
import { selectStatus, selectText, setText } from '@/app/features/editor/editorSlice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { INITIAL_PLACEHOLDER_SCHEMA } from '@/shared/config';
import { fromUrlSafeB64 } from '@/shared/lib';

export default function SchemaEditor() {
  const [storedText] = useLocalStorage<string>('prismalaser.text', INITIAL_PLACEHOLDER_SCHEMA, { raw: true });
  const dispatch = useAppDispatch();
  const sourceText = useAppSelector(selectText);
  const status = useAppSelector(selectStatus);

  useEffect(() => {
    dispatch(setText(storedText ?? ''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Populate state from a shared link if one is present
    const params = new URLSearchParams(location.search);

    if (params.has('code')) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const code = params.get('code')!;
      const decoded = fromUrlSafeB64(code);

      dispatch(setText(decoded));
    }
  }, [dispatch]);

  return (
    <section className="relative flex flex-col items-start border-r-2" style={{ maxWidth: '600px', width: '100%' }}>
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
