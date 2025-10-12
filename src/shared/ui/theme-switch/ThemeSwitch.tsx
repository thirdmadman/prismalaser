'use client';

import Image from 'next/image';

import { selectTheme, setTheme } from '@/app/features/configs/configsSlice';
import { useAppDispatch, useAppSelector } from '@/app/hooks';

const darkModeImage = (
  <Image src="/img/svg/icons/icon-dark-mode.svg" width="24" height="24" alt="dark" className="min-w-6" />
);

const lightModeImage = (
  <Image src="/img/svg/icons/icon-light-mode.svg" width="24" height="24" alt="light" className="min-w-6" />
);

export function ThemeSwitch() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const isDark = theme === 'dark';

  return (
    <div className="flex items-center justify-center min-w-[44px] min-h-[44px]">
      <button
        onClick={() => {
          dispatch(setTheme(isDark ? 'light' : 'dark'));
        }}
      >
        {isDark ? lightModeImage : darkModeImage}
      </button>
    </div>
  );
}
