import type React from 'react';
import { useRef, useState } from 'react';

import { toUrlSafeB64 } from '@/shared/lib';

interface ICopyButtonProps {
  input: string;
}

export function CopyButton({ input }: ICopyButtonProps) {
  const [showCopied, setShowCopied] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const timerRef: React.MutableRefObject<NodeJS.Timeout | null> = useRef(null);

  const copy = async () => {
    const params = new URLSearchParams({ code: toUrlSafeB64(input) });
    const toCopy = `${location.origin}?${params.toString()}`;

    await navigator.clipboard.writeText(toCopy);

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
