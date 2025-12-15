import Link from "next/link";
import { PropertyCard } from "@/components/property-card";
import { createPublicClient, getUser } from "@/lib/supabase/server";

export async function PropertyGrid() {
  const supabase = createPublicClient();
  const [{ data: properties }, user] = await Promise.all([
    supabase
      .from("properties")
      .select("*")
      .order("price_per_night", { ascending: false }),
    getUser(),
  ]);
  const isLoggedIn = !!user;

  return (
    <section
      id="properties"
      className="flex-1 bg-gray-50 dark:bg-zinc-950 py-12 sm:py-16"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-8">
          Available properties
        </h2>

        {properties && properties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <EmptyState isLoggedIn={isLoggedIn} />
        )}
      </div>
    </section>
  );
}

function EmptyState({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <div className="text-center py-16">
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        No properties listed yet.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/properties/new"
          className="px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
        >
          List your property
        </Link>
        {!isLoggedIn && (
          <Link
            href="/register"
            className="px-5 py-2.5 text-gray-700 dark:text-gray-300 font-medium rounded-lg border border-gray-300 dark:border-zinc-700 hover:border-gray-400 dark:hover:border-zinc-600 transition-colors"
          >
            Create account
          </Link>
        )}
      </div>
    </div>
  );
}
