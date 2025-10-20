import React, { useEffect, useRef, useState } from 'react';
import crownIcon from '@iconify/icons-gg/crown';
import fileIcon from '@iconify/icons-gg/file';
import menu from '@iconify/icons-gg/menu';
import optionsIcon from '@iconify/icons-gg/options';
import { Icon } from '@iconify/react';
import Image from 'next/image';

import AboutPanel from './AboutPanel';
import FilePanel from './FilePanel';
import { MenuPanel } from './MenuPanel';
import { MenuPanelButton } from './MenuPanelButton';
import { ThemeSwitch } from '@/shared/ui/theme-switch/ThemeSwitch';

const menuItems = [
  { id: 'file', icon: fileIcon, submenu: <FilePanel />, label: 'File' },
  { id: 'settings', icon: optionsIcon, submenu: null, label: 'Settings' },
  { id: 'about', icon: crownIcon, submenu: <AboutPanel />, label: 'About' },
];

export default function EditorTopMenu() {
  const [active, setActive] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!dropdownRef?.current) {
        return;
      }

      const { target } = event;

      if (target && !dropdownRef.current.contains(target as Node) && active) {
        setActive(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [active]);

  return (
    <nav
      className="fixed z-10 flex items-center w-full h-17 xl:h-13 px-6 xl:px-4 py-3 items-center bg-neutral-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-200"
      ref={dropdownRef}
    >
      <div className="w-full flex justify-between xl:justify-start gap-5 flex-wrap xl:flex-nowrap">
        <div className="flex items-center gap-4">
          <Image src="/img/logo.svg" alt="Prismalaser" width={24} height={32} />
        </div>
        <div className="hidden xl:flex items-center gap-2 w-full">
          {menuItems.map((item) => (
            <div className="relative" key={item.id}>
              <button
                className={`flex items-center px-2 py-1 gap-1 text-sm rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-600 transition ${active === item.id ? 'bg-neutral-300 dark:bg-neutral-600' : ''}`}
                onClick={() => {
                  setActive((value) => (value !== null && value === item.id ? null : item.id));
                }}
                title={item.label}
              >
                {<Icon icon={item.icon} />}
                {item.label}
              </button>
              {active && active === item.id && (
                <div className="absolute z-10 mt-2 w-56 px-6 py-3 gap-1 origin-top-right rounded-md bg-neutral-100 dark:bg-neutral-900 text-sm transition shadow-lg dark:shadow-neutral-600/50 ring-1 ring-black/5 dark:ring-white/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
                  {item.submenu ?? (
                    <MenuPanel>
                      <MenuPanelButton>Empty</MenuPanelButton>
                    </MenuPanel>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-4">
          <ThemeSwitch />
          <button
            className="flex xl:hidden items-center justify-center"
            onClick={() => {
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
          >
            <Icon className="w-8 h-8" icon={menu} />
          </button>
        </div>
        <div
          className={`absolute px-4 py-2 top-17 right-0 flex flex-col gap-3 justify-center items-start bg-neutral-100 dark:bg-neutral-900 text-lg ${isMobileMenuOpen ? '' : 'hidden'}`}
        >
          {menuItems.map((el) => (
            <React.Fragment key={el.id}>{el.submenu}</React.Fragment>
          ))}
        </div>
      </div>
    </nav>
  );
}
