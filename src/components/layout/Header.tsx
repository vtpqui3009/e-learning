import Link from "next/link";
import { Code2 } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-900/95 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/90">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2 text-gray-100 hover:text-white transition-colors">
            <Code2 className="h-6 w-6" />
            <span className="font-bold">C# Learning</span>
          </Link>
        </div>

        <nav className="flex items-center space-x-6 text-sm font-medium flex-1">
          <Link
            href="/lessons"
            className="transition-colors text-gray-300 hover:text-white"
          >
            Lessons
          </Link>
          <Link
            href="/about"
            className="transition-colors text-gray-300 hover:text-white"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
