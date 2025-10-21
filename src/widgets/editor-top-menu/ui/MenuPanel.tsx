interface IMenuPanelProps {
  children: React.ReactNode;
}

export function MenuPanel({ children }: IMenuPanelProps) {
  return <div className="flex flex-col gap-2">{children}</div>;
}
