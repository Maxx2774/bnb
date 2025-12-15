"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface BookingFormProps {
  propertyId: string;
  pricePerNight: number;
}

export function BookingForm({ propertyId, pricePerNight }: BookingFormProps) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const nights =
    checkIn && checkOut
      ? Math.max(
          0,
          Math.ceil(
            (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
          ),
        )
      : 0;

  const totalPrice = nights * pricePerNight;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut) return;

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          checkIn: format(checkIn, "yyyy-MM-dd"),
          checkOut: format(checkOut, "yyyy-MM-dd"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Booking failed");
        setLoading(false);
        return;
      }

      router.push("/bookings");
      router.refresh();
    } catch {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-3 p-3 text-sm text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-900/30">
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="block text-sm font-medium mb-2">Check-in</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !checkIn && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkIn ? format(checkIn, "MMM d") : "Select"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={(date) => {
                  setCheckIn(date);
                  if (date && checkOut && date >= checkOut) {
                    setCheckOut(undefined);
                  }
                }}
                disabled={(date) => date < today}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <span className="block text-sm font-medium mb-2">Check-out</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !checkOut && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkOut ? format(checkOut, "MMM d") : "Select"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkOut}
                onSelect={setCheckOut}
                disabled={(date) =>
                  date < today || (checkIn ? date <= checkIn : false)
                }
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {nights > 0 && (
        <div className="border-t border-gray-100 dark:border-zinc-700 pt-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              ${pricePerNight} x {nights} {nights === 1 ? "night" : "nights"}
            </span>
            <span>${totalPrice}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-gray-100 dark:border-zinc-700">
            <span className="font-semibold">Total</span>
            <span className="font-bold text-lg">${totalPrice}</span>
          </div>
        </div>
      )}

      <Button
        type="submit"
        disabled={loading || nights === 0}
        className="w-full"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Booking...
          </>
        ) : (
          "Reserve"
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        You won&apos;t be charged yet
      </p>
    </form>
  );
}
