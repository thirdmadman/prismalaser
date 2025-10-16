'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import BurgerMenuButton from './BurgerMenuButton';
import { ThemeSwitch } from '@/shared/ui/theme-switch/ThemeSwitch';

const HEADER_MENU_LINKS = [
  { name: 'Editor', href: '/' },
  { name: 'About', href: '/about' },
];

export default function WebPagesHeader() {
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed w-full z-10">
      <nav className="flex justify-center items-center w-full min-h-16 bg-gray-100 border-gray-200 px-4 lg:px-6 py-2.5 bg-white dark:bg-neutral-900">
        <div className="max-w-screen-xl w-full h-full flex justify-between items-center flex-wrap">
          <Link href="/" className="flex items-center">
            <div className="flex items-center gap-2">
              <Image src="/img/logo.svg" alt="Prismalaser" width={32} height={32} />
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Prismalaser</span>
            </div>
          </Link>
          <div className="flex items-center lg:order-2 lg:hidden">
            <ThemeSwitch />
            <BurgerMenuButton
              isMenuOpened={isMenuOpened}
              onClickAction={() => {
                setIsMenuOpened(!isMenuOpened);
              }}
            />
          </div>
          <div
            className={`justify-between items-center w-full lg:flex lg:w-auto lg:order-1 ${isMenuOpened ? '' : 'hidden'}`}
            id="mobile-menu-2"
          >
            <div className="hidden px-6 flex items-center lg:block">
              <ThemeSwitch />
            </div>
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              {HEADER_MENU_LINKS.map((el) => (
                <li key={el.name}>
                  <Link
                    href={el.href}
                    className={
                      el.href === pathname
                        ? 'block py-2 pr-4 pl-3 text-white rounded bg-primary-700 lg:bg-transparent lg:text-primary-700 lg:p-0 dark:text-white'
                        : 'block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700'
                    }
                    aria-current="page"
                  >
                    {el.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
