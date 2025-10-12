'use client';
import type { ReactNode } from 'react';
import { useEffect } from 'react';

import { selectTheme } from './features/configs/configsSlice';
import { useAppSelector } from './hooks';

interface IThemeProviderProps {
  readonly children: ReactNode;
}

export default function ThemeProvider({ children }: IThemeProviderProps) {
  const theme = useAppSelector(selectTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
}
