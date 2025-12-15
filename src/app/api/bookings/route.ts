import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createClient, getUserId } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  let userId: string;
  try {
    userId = await getUserId();
  } catch {
    return NextResponse.json(
      { error: "You must be logged in to book" },
      { status: 401 },
    );
  }

  const body = await request.json();
  const { propertyId, checkIn, checkOut } = body;

  if (!propertyId || !checkIn || !checkOut) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 },
    );
  }

  if (new Date(checkOut) <= new Date(checkIn)) {
    return NextResponse.json(
      { error: "Check-out date must be after check-in date" },
      { status: 400 },
    );
  }

  const { error } = await supabase.from("bookings").insert({
    user_id: userId,
    property_id: propertyId,
    check_in_date: checkIn,
    check_out_date: checkOut,
  });

  if (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  revalidatePath("/bookings");
  revalidatePath("/my-properties");

  return NextResponse.json({ success: true });
}
