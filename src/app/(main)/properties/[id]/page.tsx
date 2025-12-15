import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient, getUser, getUserProfile } from "@/lib/supabase/server";
import { BookingForm } from "./booking-form";
import { DeletePropertyButton } from "./delete-property-button";

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const user = await getUser();
  const userProfile = await getUserProfile();

  const { data: property, error } = await supabase
    .from("properties")
    .select("*, owner:user_profiles(*)")
    .eq("id", id)
    .single();

  if (error || !property) {
    notFound();
  }

  const isOwner = user?.id === property.owner_id;
  const isAdmin = userProfile?.is_admin ?? false;
  const canManage = isOwner || isAdmin;

  return (
    <div className="flex-1 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video relative bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden">
              {property.image_url ? (
                <Image
                  src={property.image_url}
                  alt={property.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-gray-300 dark:text-zinc-600"
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
            </div>

            <div>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-semibold">{property.name}</h1>
                  <p className="text-muted-foreground mt-1">
                    {property.location}
                  </p>
                </div>

                {canManage && (
                  <div className="flex gap-2">
                    {isOwner && (
                      <Link
                        href={`/properties/${property.id}/edit`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground border border-gray-200 dark:border-zinc-700 rounded-md hover:border-gray-300 dark:hover:border-zinc-600 transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </Link>
                    )}
                    <DeletePropertyButton propertyId={property.id} />
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-zinc-800">
              <h2 className="text-lg font-medium mb-3">About this place</h2>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {property.description}
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-6">
                <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-gray-200 dark:border-zinc-800">
                  <span className="text-2xl font-semibold">
                    ${property.price_per_night}
                  </span>
                  <span className="text-muted-foreground">/ night</span>
                </div>

                {property.is_available ? (
                  user ? (
                    isOwner ? (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">
                          You own this property
                        </p>
                      </div>
                    ) : (
                      <BookingForm
                        propertyId={property.id}
                        pricePerNight={property.price_per_night}
                      />
                    )
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground mb-4">
                        Sign in to book this property
                      </p>
                      <Link
                        href={`/login?redirectTo=/properties/${property.id}`}
                        className="block w-full py-2 px-4 bg-primary text-primary-foreground text-center font-medium rounded-md hover:bg-primary/90 transition-colors"
                      >
                        Sign in to book
                      </Link>
                    </div>
                  )
                ) : (
                  <div className="text-center py-4">
                    <p className="text-red-600 font-medium">
                      Currently unavailable
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
