import github from '@iconify/icons-simple-icons/github';
import mastodon from '@iconify/icons-simple-icons/mastodon';
import prisma from '@iconify/icons-simple-icons/prisma';
import { Icon } from '@iconify/react';
import Image from 'next/image';

export function HeaderNavigation() {
  return (
    <nav className="flex items-center w-full py-3 pl-5 pr-4 text-white bg-gray-600" style={{ gridArea: 'nav' }}>
      <div className="flex items-center gap-4">
        <Image src="/img/logo.svg" alt="Prismalaser" width={32} height={32} />
        <span className="font-thin text-xl">Prismalaser</span>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-4">
        <a className="button icon light" href="https://prisma.io" title="Prisma website" aria-label="Prisma website">
          <Icon icon={prisma} height={24} />
        </a>

        <a
          className="button icon light"
          href="https://github.com/Ovyerus/prismaliser"
          title="Prismaliser GitHub repository"
          aria-label="Prismaliser GitHub repository"
        >
          <Icon icon={github} height={24} />
        </a>
        <a
          className="button icon light"
          href="https://aus.social/@ovyerus"
          title="Author's Mastodon account"
          aria-label="Author's Mastodon account"
        >
          <Icon icon={mastodon} height={24} />
        </a>
      </div>
    </nav>
  );
}
