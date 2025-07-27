'use client';
import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { setupListeners } from '@reduxjs/toolkit/query';
import { Provider } from 'react-redux';

import type { TAppStore } from '@/app/store';
import { makeStore } from '@/app/store';

interface IStoreProviderProps {
  readonly children: ReactNode;
}

export const StoreProvider = ({ children }: IStoreProviderProps) => {
  const storeRef = useRef<TAppStore | null>(null);

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  useEffect(() => {
    if (storeRef.current != null) {
      // configure listeners using the provided defaults
      // optional, but required for `refetchOnFocus`/`refetchOnReconnect` behaviors
      const unsubscribe = setupListeners(storeRef.current.dispatch);
      return unsubscribe;
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
};
