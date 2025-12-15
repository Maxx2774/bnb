import Link from "next/link";

export function HeroSection() {
  return (
    <section className="bg-white dark:bg-zinc-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 dark:text-white tracking-tight">
            Find your next stay
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Browse vacation rentals from verified hosts.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#properties"
              className="px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Browse properties
            </Link>
            <Link
              href="/properties/new"
              className="px-5 py-2.5 text-gray-700 dark:text-gray-300 font-medium rounded-lg border border-gray-300 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-600 transition-colors"
            >
              List your place
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
