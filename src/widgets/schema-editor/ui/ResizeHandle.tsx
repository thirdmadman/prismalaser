'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface IResizeHandleProps {
  sectionRef: React.RefObject<HTMLElement | null>;
  minWidth: number;
  maxWidth: number;
  currentWidth: number;
  onWidthChange: (width: number) => void;
  onWidthCommit: (width: number) => void;
}

export function ResizeHandle({
  sectionRef,
  minWidth,
  maxWidth,
  currentWidth,
  onWidthChange,
  onWidthCommit,
}: IResizeHandleProps) {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevBodyCursorRef = useRef<string>('');
  const prevBodyUserSelectRef = useRef<string>('');
  const capturedPointerIdRef = useRef<number | null>(null);

  // Refs to track initial state
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      setIsDragging(true);
      // Capture pointer events exclusively to this element
      capturedPointerIdRef.current = e.pointerId;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);

      // Absolute pointer X position at start of drag
      startXRef.current = e.clientX;

      // Measure the ACTUAL rendered width of the section element at grip time
      if (sectionRef.current) {
        startWidthRef.current = sectionRef.current.offsetWidth;
      } else {
        startWidthRef.current = currentWidth;
      }
    },
    [sectionRef, currentWidth]
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      const delta = e.clientX - startXRef.current;
      const newWidth = Math.min(maxWidth, Math.max(minWidth, startWidthRef.current + delta));

      onWidthChange(newWidth);
    },
    [minWidth, maxWidth, onWidthChange]
  );

  const handlePointerUp = useCallback(() => {
    if (!isDragging) {
      return;
    }
    setIsDragging(false);

    // Release pointer capture
    if (capturedPointerIdRef.current !== null && containerRef.current) {
      try {
        containerRef.current.releasePointerCapture(capturedPointerIdRef.current);
      } catch {
        // Already released
      }
      capturedPointerIdRef.current = null;
    }

    // Measure and commit final width from actual DOM
    if (sectionRef.current) {
      const finalWidth = Math.min(maxWidth, Math.max(minWidth, sectionRef.current.offsetWidth));
      onWidthCommit(finalWidth);
    }
  }, [isDragging, sectionRef, minWidth, maxWidth, onWidthCommit]);

  // Handle pointercancel
  const handlePointerCancel = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    // Release pointer capture
    if (capturedPointerIdRef.current !== null && containerRef.current) {
      try {
        containerRef.current.releasePointerCapture(capturedPointerIdRef.current);
      } catch {
        // Already released
      }
      capturedPointerIdRef.current = null;
    }
  }, [isDragging]);

  // Handle lost pointer capture
  const handleLostPointerCapture = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
    }
  }, [isDragging]);

  // Handle window blur
  const handleWindowBlur = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);

      // Release pointer capture
      if (capturedPointerIdRef.current !== null && containerRef.current) {
        try {
          containerRef.current.releasePointerCapture(capturedPointerIdRef.current);
        } catch {
          // Already released
        }
        capturedPointerIdRef.current = null;
      }
    }
  }, [isDragging]);

  // Handle document hidden (not visible)
  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === 'hidden' && isDragging) {
      setIsDragging(false);

      // Release pointer capture
      if (capturedPointerIdRef.current !== null && containerRef.current) {
        try {
          containerRef.current.releasePointerCapture(capturedPointerIdRef.current);
        } catch {
          // Already released
        }
        capturedPointerIdRef.current = null;
      }
    }
  }, [isDragging]);

  // Attach/detach document/window listeners and cursor style
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('blur', handleWindowBlur);
      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
      document.addEventListener('pointercancel', handlePointerCancel);
      document.addEventListener('lostpointercapture', handleLostPointerCapture);
      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Save previous body styles before overwriting
      prevBodyCursorRef.current = document.body.style.cursor || '';
      prevBodyUserSelectRef.current = document.body.style.userSelect || '';

      // Prevent text selection during drag
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      // Restore previous body styles
      document.body.style.cursor = prevBodyCursorRef.current;
      document.body.style.userSelect = prevBodyUserSelectRef.current;

      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointercancel', handlePointerCancel);
      document.removeEventListener('lostpointercapture', handleLostPointerCapture);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [
    isDragging,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handleLostPointerCapture,
    handleWindowBlur,
    handleVisibilityChange,
  ]);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      role="separator"
      aria-orientation="vertical"
      aria-valuemin={minWidth}
      aria-valuemax={maxWidth}
      aria-valuenow={currentWidth}
      aria-label="Resize schema editor"
      style={{
        position: 'absolute',
        right: '-8px',
        top: 0,
        height: '100%',
        width: '16px',
        cursor: 'col-resize',
      }}
      className={`absolute right-0 top-0 h-full cursor-col-resize z-10 ${
        isDragging
          ? 'bg-blue-500/50'
          : 'bg-blue-500/0 hover:bg-blue-500/50 focus:bg-blue-500/50 focus-visible:bg-blue-500/50'
      }`}
    />
  );
}
