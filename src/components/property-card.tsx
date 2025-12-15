import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/lib/supabase/types";

interface PropertyCardProps {
  property: Property;
  featured?: boolean;
}

export function PropertyCard({ property, featured }: PropertyCardProps) {
  return (
    <Link
      href={`/properties/${property.id}`}
      className={`group block bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 overflow-hidden hover:border-gray-300 dark:hover:border-zinc-700 transition-colors ${featured ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : ""}`}
    >
      <div
        className={`relative bg-gray-100 dark:bg-zinc-800 ${featured ? "aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[300px]" : "aspect-4/3"}`}
      >
        {property.image_url ? (
          <Image
            src={property.image_url}
            alt={property.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className={`text-gray-300 dark:text-zinc-600 ${featured ? "w-16 h-16" : "w-12 h-12"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </div>
        )}

        {!property.is_available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-sm text-white font-medium">Unavailable</span>
          </div>
        )}
      </div>

      <div className={featured ? "p-5" : "p-4"}>
        <div className="flex items-start justify-between gap-2">
          <h3
            className={`font-medium text-gray-900 dark:text-white truncate ${featured ? "text-lg" : ""}`}
          >
            {property.name}
          </h3>
          <span
            className={`font-medium text-gray-900 dark:text-white whitespace-nowrap ${featured ? "text-base" : "text-sm"}`}
          >
            ${property.price_per_night}
            <span className="text-gray-500 dark:text-gray-400 font-normal">
              /night
            </span>
          </span>
        </div>

        <p
          className={`text-gray-500 dark:text-gray-400 mt-1 ${featured ? "text-base" : "text-sm"}`}
        >
          {property.location}
        </p>
      </div>
    </Link>
  );
}
