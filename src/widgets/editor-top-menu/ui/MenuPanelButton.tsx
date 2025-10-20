interface IMenuPanelButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function MenuPanelButton({ children, onClick, className }: IMenuPanelButtonProps) {
  return (
    <button
      className={`block px-2 py-1 rounded hover:bg-neutral-300 dark:hover:bg-neutral-600 transition text-left ${className ?? ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
