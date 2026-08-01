'use client';

import { useEffect, useRef, useState } from 'react';
import closeIcon from '@iconify/icons-gg/close-o';
import { Icon } from '@iconify/react';
import LZString from 'lz-string';
import { useLocalStorage } from 'react-use';

import { EditorView } from './EditorView';
import { ResizeHandle } from './ResizeHandle';
import { selectSchemaEditorWidth, setSchemaEditorWidth } from '@/app/features/configs/configsSlice';
import { selectStatus, selectText, setText } from '@/app/features/editor/editorSlice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { INITIAL_PLACEHOLDER_SCHEMA } from '@/shared/config';

const MIN_WIDTH = 250;
const MAX_WIDTH = 1200;
const DEFAULT_WIDTH = 640;
const EDITOR_WIDTH_LOCAL_STORAGE_KEY = 'Prismalaser.schemaEditorWidth';
const EDITOR_SCHEMA_COMPRESSED_LOCAL_STORAGE_KEY = 'Prismalaser.schemaCompressed';
const XL_BREAKPOINT = 1280; // Tailwind's xl breakpoint

export default function SchemaEditor() {
  const [isMounted, setIsMounted] = useState(false);
  const [isXL, setIsXL] = useState(false);
  const widthInitializedRef = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [savedEditorWidth, saveEditorWidth] = useLocalStorage<number | null>(EDITOR_WIDTH_LOCAL_STORAGE_KEY, null);
  const [storedText] = useLocalStorage<string>(EDITOR_SCHEMA_COMPRESSED_LOCAL_STORAGE_KEY, INITIAL_PLACEHOLDER_SCHEMA, {
    raw: true,
  });

  const dispatch = useAppDispatch();
  const sourceText = useAppSelector(selectText);
  const status = useAppSelector(selectStatus);
  const editorWidth = useAppSelector(selectSchemaEditorWidth);

  // Check breakpoint on mount and resize
  useEffect(() => {
    setIsMounted(true);
    const checkXL = () => {
      setIsXL(window.innerWidth >= XL_BREAKPOINT);
    };
    checkXL();
    window.addEventListener('resize', checkXL);
    return () => {
      window.removeEventListener('resize', checkXL);
    };
  }, []);

  // Initialize Redux from useLocalStorage on mount
  useEffect(() => {
    if (widthInitializedRef.current) {
      return;
    }
    widthInitializedRef.current = true;

    const width = savedEditorWidth ?? null;
    if (width !== null) {
      const clamped = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, width));
      dispatch(setSchemaEditorWidth(clamped));
    }
  }, [dispatch, savedEditorWidth]);

  useEffect(() => {
    let decompressedString = null;
    if (!!storedText && storedText !== INITIAL_PLACEHOLDER_SCHEMA) {
      decompressedString = LZString.decompress(storedText);
    }

    dispatch(setText(decompressedString ?? storedText ?? ''));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.has('data')) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const data = params.get('data')!;
      const decompressed = LZString.decompressFromEncodedURIComponent(data);

      dispatch(setText(decompressed));
    }
  }, [dispatch]);

  return (
    <section
      ref={sectionRef}
      className="relative flex shrink-0 flex-col items-start border-r-2 bg-neutral-100 dark:bg-neutral-800 dark:text-gray-400 xl:max-h-full"
      style={{
        ...(isMounted && isXL && editorWidth !== null ? { width: editorWidth } : { width: '100%' }),
      }}
    >
      <EditorView value={sourceText} />

      {isXL && (
        <div className="hidden xl:block">
          <ResizeHandle
            sectionRef={sectionRef}
            minWidth={MIN_WIDTH}
            maxWidth={MAX_WIDTH}
            currentWidth={editorWidth ?? DEFAULT_WIDTH}
            onWidthChange={(width: number) => {
              dispatch(setSchemaEditorWidth(width));
            }}
            onWidthCommit={(width: number) => {
              dispatch(setSchemaEditorWidth(width));
              saveEditorWidth(width);
            }}
          />
        </div>
      )}

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
