import Link from "next/link";
import { createClient, getUserId } from "@/lib/supabase/server";
import { CancelBookingButton } from "./cancel-booking-button";

export default async function BookingsPage() {
  const supabase = await createClient();
  const userId = await getUserId();

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*, property:properties(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bookings:", error);
  }

  return (
    <div className="flex-1 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">My Bookings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View and manage your reservations
          </p>
        </div>

        {bookings && bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const checkIn = new Date(booking.check_in_date);
              const checkOut = new Date(booking.check_out_date);
              const nights = Math.ceil(
                (checkOut.getTime() - checkIn.getTime()) /
                  (1000 * 60 * 60 * 24),
              );

              return (
                <div
                  key={booking.id}
                  className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden hover:border-gray-300 dark:hover:border-zinc-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-48 h-40 sm:h-auto flex-shrink-0 bg-gray-100 dark:bg-zinc-800">
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
                    </div>

                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/properties/${booking.property_id}`}
                            className="font-medium text-gray-900 dark:text-white hover:underline"
                          >
                            {booking.property?.name || "Property"}
                          </Link>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {booking.property?.location}
                          </p>
                        </div>
                      </div>

                      <div className="mt-2">
                        <StatusBadge status={booking.status} />
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Dates: </span>
                          <span className="text-gray-900 dark:text-white">
                            {checkIn.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}{" "}
                            -{" "}
                            {checkOut.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            {nights} {nights === 1 ? "night" : "nights"}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                        <span className="text-lg font-semibold text-gray-900 dark:text-white">
                          ${booking.total_price}
                        </span>
                        <CancelBookingButton bookingId={booking.id} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
              <p className="text-sm text-muted-foreground mb-6">
                When you book a property, it will appear here.
              </p>

              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Browse properties
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusColors: Record<string, string> = {
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    accepted:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full capitalize ${statusColors[status] || ""}`}
    >
      {status}
    </span>
  );
}
