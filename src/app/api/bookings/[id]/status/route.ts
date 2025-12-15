import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createClient, getUserId } from "@/lib/supabase/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: bookingId } = await params;
  const supabase = await createClient();

  let userId: string;
  try {
    userId = await getUserId();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { status } = body;

  if (!status || !["accepted", "rejected"].includes(status)) {
    return NextResponse.json(
      { error: "Invalid status. Must be 'accepted' or 'rejected'" },
      { status: 400 },
    );
  }

  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("property_id, property:properties(owner_id)")
    .eq("id", bookingId)
    .single();

  if (fetchError || !booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const property = booking.property as { owner_id: string } | null;
  if (property?.owner_id !== userId) {
    return NextResponse.json(
      { error: "You are not authorized to update this booking" },
      { status: 403 },
    );
  }

  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", bookingId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  revalidatePath("/my-properties");
  revalidatePath("/bookings");

  return NextResponse.json({ success: true });
}
