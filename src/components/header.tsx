import Link from "next/link";
import { getUser } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export async function Header() {
  const user = await getUser();

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-zinc-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="text-base font-semibold">
            staybnb
          </Link>

          <nav className="flex items-center gap-1">
            {user ? (
              <>
                <Link
                  href="/properties/new"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  <span className="hidden sm:inline">List property</span>
                </Link>
                <Link
                  href="/my-properties"
                  className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
                >
                  My properties
                </Link>
                <Link
                  href="/bookings"
                  className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Bookings
                </Link>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
