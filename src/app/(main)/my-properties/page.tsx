import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, getUser } from "@/lib/supabase/server";
import { BookingStatusButtons } from "./booking-status-buttons";

export default async function MyPropertiesPage() {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    redirect("/login?redirectTo=/my-properties");
  }

  const { data: properties, error: propertiesError } = await supabase
    .from("properties")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (propertiesError) {
    console.error("Error fetching properties:", propertiesError);
  }

  const propertyIds = properties?.map((p) => p.id) || [];

  const { data: bookings, error: bookingsError } =
    propertyIds.length > 0
      ? await supabase
          .from("bookings")
          .select("*, property:properties(*), guest:user_profiles(*)")
          .in("property_id", propertyIds)
          .order("created_at", { ascending: false })
      : { data: [], error: null };

  if (bookingsError) {
    console.error("Error fetching bookings:", bookingsError);
  }

  return (
    <div className="flex-1 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold">My Properties</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your listings and bookings
            </p>
          </div>
          {properties && properties.length > 0 && (
            <Link
              href="/properties/new"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Property
            </Link>
          )}
        </div>

        {properties && properties.length > 0 ? (
          <div className="space-y-10">
            <section>
              <h2 className="text-lg font-medium mb-4">
                Your Listings ({properties.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {properties.map((property) => {
                  const propertyBookings =
                    bookings?.filter((b) => b.property_id === property.id) ||
                    [];

                  return (
                    <Link
                      key={property.id}
                      href={`/properties/${property.id}`}
                      className="group block bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 overflow-hidden hover:border-gray-300 dark:hover:border-zinc-700 transition-colors"
                    >
                      <div className="aspect-4/3 relative bg-gray-100 dark:bg-zinc-800">
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="w-12 h-12 text-gray-300 dark:text-zinc-600"
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
                        {!property.is_available && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-sm text-white font-medium">
                              Unavailable
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-medium text-gray-900 dark:text-white truncate">
                            {property.name}
                          </h3>
                          <span className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                            ${property.price_per_night}
                            <span className="text-gray-500 dark:text-gray-400 font-normal">
                              /night
                            </span>
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {property.location}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          {propertyBookings.length} booking
                          {propertyBookings.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {bookings && bookings.length > 0 && (
              <section>
                <h2 className="text-lg font-medium mb-4">All Bookings</h2>
                <div className="space-y-3">
                  {bookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-medium mb-2">No properties yet</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Start earning by listing your first property.
              </p>

              <Link
                href="/properties/new"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                List Your First Property
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface BookingWithGuest {
  id: string;
  property_id: string;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  status: "pending" | "accepted" | "rejected";
  guest: { name: string; email: string } | null;
  property: { name: string; location: string } | null;
}

function BookingCard({ booking }: { booking: BookingWithGuest }) {
  const checkIn = new Date(booking.check_in_date);
  const checkOut = new Date(booking.check_out_date);
  const nights = Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
  );

  const statusColors = {
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    accepted:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-gray-200 dark:bg-zinc-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 font-medium text-sm">
            {booking.guest?.name?.charAt(0).toUpperCase() || "G"}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 dark:text-white truncate">
              {booking.guest?.name || "Guest"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {booking.guest?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs">Dates</p>
            <p className="text-gray-900 dark:text-white">
              {checkIn.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}{" "}
              -{" "}
              {checkOut.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs">Nights</p>
            <p className="text-gray-900 dark:text-white">{nights}</p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs">Total</p>
            <p className="font-medium text-gray-900 dark:text-white">
              ${booking.total_price}
            </p>
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs">Status</p>
            <span
              className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full capitalize ${statusColors[booking.status]}`}
            >
              {booking.status}
            </span>
          </div>
        </div>
      </div>

      {booking.status === "pending" && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800 flex gap-2 justify-end">
          <BookingStatusButtons bookingId={booking.id} />
        </div>
      )}
    </div>
  );
}
