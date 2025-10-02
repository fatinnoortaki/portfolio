import Link from 'next/link';
import { Code, LogOut, Eye } from 'lucide-react';

interface AdminNavProps {
  isMobile?: boolean;
}

export function AdminNav({ isMobile = false }: AdminNavProps) {
  return (
    <nav className="flex flex-col gap-4 text-sm text-muted-foreground h-full">
      <Link
        href="/admin"
        className="flex items-center gap-2 font-semibold text-foreground font-headline"
      >
        <Code className="h-6 w-6" />
        <span>Admin Panel</span>
      </Link>
      <div className="flex-1">
      {/* Navigation items can be added here in the future */}
      </div>
      <div className="mt-auto flex flex-col gap-2">
         <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          target="_blank"
        >
          <Eye className="h-4 w-4" />
          View Live Site
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Link>
      </div>
    </nav>
  );
}
