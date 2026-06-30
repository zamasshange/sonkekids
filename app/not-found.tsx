import Link from "next/link";

export default function NotFound() {
  return (
    <main className="sonke-not-found">
      <h1>Page not found</h1>
      <p>That page is not here yet. Try one of these instead:</p>
      <nav className="sonke-not-found-links">
        <Link href="/">Home</Link>
        <Link href="/games">Games</Link>
        <Link href="/videos">Videos</Link>
        <Link href="/games/browse">Browse all games</Link>
        <Link href="/games/search">Search</Link>
      </nav>
    </main>
  );
}
