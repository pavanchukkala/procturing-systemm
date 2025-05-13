import { Briefcase } from 'lucide-react';
import Link from 'next/link';

export function AppLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const textSizeClass = size === 'sm' ? 'text-xl' : size === 'md' ? 'text-2xl' : 'text-3xl';
  const iconSize = size === 'sm' ? 18 : size === 'md' ? 24 : 30;

  return (
    <Link href="/" className="flex items-center gap-2 group">
      <Briefcase className="text-primary group-hover:text-accent transition-colors" size={iconSize} aria-hidden="true" />
      <h1 className={`font-bold text-foreground group-hover:text-primary transition-colors ${textSizeClass}`}>
        Proctoring System
      </h1>
    </Link>
  );
}
