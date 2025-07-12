import type React from 'react';
import cc from 'classcat';

import { HeaderNavigation } from '@/widgets/header-navigation';

import styles from './Layout.module.scss';

interface IPageLayoutProps {
  children: React.ReactNode;
  noEditor?: boolean;
}

export function PageLayout({ children, noEditor = false }: IPageLayoutProps) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <main className={cc([styles.grid, 'relative', 'h-screen', 'w-screen', { [styles.noEditor as any]: noEditor }])}>
      <HeaderNavigation />
      {children}
    </main>
  );
}
