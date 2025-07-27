import type React from 'react';
import { useRef, useState } from 'react';

import { selectText } from '@/app/features/editor/editorSlice';
import { useAppSelector } from '@/app/hooks';
import { copyUrlToClipboard } from '@/shared/lib/copyUrlToClipboard';

export function CopyButton() {
  const [showCopied, setShowCopied] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const timerRef: React.MutableRefObject<NodeJS.Timeout | null> = useRef(null);

  const text = useAppSelector(selectText);

  const copy = async () => {
    await copyUrlToClipboard(text);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setShowCopied(false);
    }, 2000);

    setShowCopied(true);
  };

  return (
    <button type="button" className="button floating" title="Copy link" aria-label="Copy link" onClick={copy}>
      {showCopied ? 'Copied!' : 'Copy link'}
    </button>
  );
}
