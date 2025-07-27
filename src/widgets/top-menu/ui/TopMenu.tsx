import { useEffect, useRef, useState } from 'react';
import CrownIcon from '@iconify/icons-gg/crown';
import FileIcon from '@iconify/icons-gg/file';
import OptionsIcon from '@iconify/icons-gg/options';
import { Icon } from '@iconify/react';
import Image from 'next/image';

const menuItems = [
  { id: 'file', icon: FileIcon, submenu: <FilePanel />, label: 'File' },
  { id: 'settings', icon: OptionsIcon, submenu: <SettingsPanel />, label: 'Settings' },
  { id: 'about', icon: CrownIcon, submenu: <AboutPanel />, label: 'About' },
];

function FilePanel() {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <button className="block px-2 py-1 rounded hover:bg-[#333] transition text-left">Format</button>
      <button className="block px-2 py-1 rounded hover:bg-[#333] transition text-left">Download Schema</button>
      <button className="block px-2 py-1 rounded hover:bg-[#333] transition text-left">Copy link</button>
    </div>
  );
}

function AboutPanel() {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <button className="block px-2 py-1 rounded hover:bg-[#333] transition text-left">Empty</button>
    </div>
  );
}

function SettingsPanel() {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <button className="block px-2 py-1 rounded hover:bg-[#333] transition text-left">Empty</button>
    </div>
  );
}

export default function TopMenu() {
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
      className="flex items-center w-full px-4 py-3 bg-[#1e1e1e] text-white items-center gap-5"
      style={{ gridArea: 'nav' }}
      ref={dropdownRef}
    >
      <div className="flex items-center gap-4">
        <Image src="/img/logo.svg" alt="Prismalaser" width={24} height={32} />
      </div>
      <div className="flex gap-2">
        {menuItems.map((item) => (
          <div className="relative" key={item.id}>
            <button
              className={`flex items-center px-2 py-1 gap-1 text-sm rounded-md hover:bg-[#333] transition ${active === item.id ? 'bg-[#3c3c3c]' : ''}`}
              onClick={() => {
                setActive((value) => (value !== null && value === item.id ? null : item.id));
              }}
              title={item.label}
            >
              {<Icon icon={item.icon} />}
              {item.label}
            </button>
            {active && active === item.id && (
              <div className="absolute z-10 mt-2 w-56 px-6 py-3 gap-1 origin-top-right rounded-md bg-[#1e1e1e] text-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in">
                {item.submenu}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
