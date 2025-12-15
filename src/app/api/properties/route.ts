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
      { error: "You must be logged in to create a property" },
      { status: 401 },
    );
  }

  const body = await request.json();
  const { name, description, location, pricePerNight, imageUrl } = body;

  if (!name || !description || !location || !pricePerNight) {
    return NextResponse.json(
      { error: "All required fields must be filled" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("properties")
    .insert({
      owner_id: userId,
      name,
      description,
      location,
      price_per_night: pricePerNight,
      image_url: imageUrl || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  revalidatePath("/");

  return NextResponse.json({ success: true, propertyId: data.id });
}
