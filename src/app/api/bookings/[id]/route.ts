import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createClient, getUserId } from "@/lib/supabase/server";

export async function DELETE(
  _request: Request,
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

  const { data: booking } = await supabase
    .from("bookings")
    .select("user_id")
    .eq("id", bookingId)
    .single();

  if (!booking || booking.user_id !== userId) {
    return NextResponse.json(
      { error: "You can only cancel your own bookings" },
      { status: 403 },
    );
  }

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  revalidatePath("/bookings");
  revalidatePath("/my-properties");

  return NextResponse.json({ success: true });
}
