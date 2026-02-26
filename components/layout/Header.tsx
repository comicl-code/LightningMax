import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <span className="text-2xl">🏰</span>
          <div>
            <h1 className="text-lg font-bold leading-tight">WDW Optimizer</h1>
            <p className="text-xs opacity-80">March 15–20, 2026 · Group of 15</p>
          </div>
        </Link>
        <nav className="flex gap-3 text-sm">
          <Link href="/" className="hover:bg-white/20 px-3 py-1 rounded transition-colors">
            🗓 Trip
          </Link>
          <Link href="/park/magic-kingdom" className="hover:bg-white/20 px-3 py-1 rounded transition-colors">
            ⏱ Live Waits
          </Link>
        </nav>
      </div>
    </header>
  );
}
