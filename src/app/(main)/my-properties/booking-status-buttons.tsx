"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function BookingStatusButtons({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleStatusUpdate(status: "accepted" | "rejected") {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to update booking status");
      } else {
        router.refresh();
      }
    } catch {
      alert("An unexpected error occurred");
    }

    setIsLoading(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => handleStatusUpdate("rejected")}
        disabled={isLoading}
        className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
      >
        Reject
      </button>
      <button
        type="button"
        onClick={() => handleStatusUpdate("accepted")}
        disabled={isLoading}
        className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
      >
        Accept
      </button>
    </>
  );
}
