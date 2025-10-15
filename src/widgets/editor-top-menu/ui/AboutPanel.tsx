import Link from 'next/link';

export default function AboutPanel() {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <Link href="/about" className="block px-2 py-1 rounded hover:bg-[#333] transition text-left">
        About project
      </Link>
    </div>
  );
}
