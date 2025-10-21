import Link from 'next/link';

import { MenuPanel } from './MenuPanel';

export default function AboutPanel() {
  return (
    <MenuPanel>
      <Link
        href="/about"
        className="block px-2 py-1 rounded hover:bg-neutral-300 dark:hover:bg-neutral-600 transition text-left"
      >
        About project
      </Link>
    </MenuPanel>
  );
}
