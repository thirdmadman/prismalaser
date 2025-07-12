import cc from 'classcat';
import React from 'react';

import styles from './Layout.module.scss';
import { HeaderNavigation } from '@/widgets/header-navigation';

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
