import { useEffect, useRef, useState } from 'react';
import crownIcon from '@iconify/icons-gg/crown';
import fileIcon from '@iconify/icons-gg/file';
import optionsIcon from '@iconify/icons-gg/options';
import { Icon } from '@iconify/react';
import Image from 'next/image';

import AboutPanel from './AboutPanel';
import FilePanel from './FilePanel';
import SettingsPanel from './SettingsPanel';

const menuItems = [
  { id: 'file', icon: fileIcon, submenu: <FilePanel />, label: 'File' },
  { id: 'settings', icon: optionsIcon, submenu: <SettingsPanel />, label: 'Settings' },
  { id: 'about', icon: crownIcon, submenu: <AboutPanel />, label: 'About' },
];

export default function EditorTopMenu() {
  const [active, setActive] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
      className="flex items-center w-full px-4 py-3 text-white items-center gap-5 bg-neutral-100 dark:bg-neutral-900"
      style={{ position: 'absolute', zIndex: 10 }}
      ref={dropdownRef}
    >
      <div className="flex items-center gap-4">
        <Image src="/img/logo.svg" alt="Prismalaser" width={24} height={32} />
      </div>
      <div className="flex gap-2">
        {menuItems.map((item) => (
          <div className="relative" key={item.id}>
            <button
              className={`flex items-center px-2 py-1 gap-1 text-sm rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-600 transition text-gray-600 dark:text-gray-200 ${active === item.id ? 'bg-neutral-300 dark:bg-neutral-600' : ''}`}
              onClick={() => {
                setActive((value) => (value !== null && value === item.id ? null : item.id));
              }}
              title={item.label}
            >
              {<Icon icon={item.icon} />}
              {item.label}
            </button>
            {active && active === item.id && (
              <div className="absolute z-10 mt-2 w-56 px-6 py-3 gap-1 origin-top-right rounded-md bg-neutral-100 dark:bg-neutral-900 transition text-gray-600 dark:text-gray-200 shadow-lg dark:shadow-neutral-600/50 ring-1 ring-black/5 dark:ring-white/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
                {item.submenu}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
