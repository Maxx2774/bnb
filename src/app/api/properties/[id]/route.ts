import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createClient, getUserId } from "@/lib/supabase/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: propertyId } = await params;
  const supabase = await createClient();

  let userId: string;
  try {
    userId = await getUserId();
  } catch {
    return NextResponse.json(
      { error: "You must be logged in to update a property" },
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

  const { data: property } = await supabase
    .from("properties")
    .select("owner_id")
    .eq("id", propertyId)
    .single();

  if (!property || property.owner_id !== userId) {
    return NextResponse.json(
      { error: "You can only edit your own properties" },
      { status: 403 },
    );
  }

  const { error } = await supabase
    .from("properties")
    .update({
      name,
      description,
      location,
      price_per_night: pricePerNight,
      image_url: imageUrl || null,
    })
    .eq("id", propertyId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  revalidatePath("/");
  revalidatePath(`/properties/${propertyId}`);

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: propertyId } = await params;
  const supabase = await createClient();

  let userId: string;
  try {
    userId = await getUserId();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: property } = await supabase
    .from("properties")
    .select("owner_id")
    .eq("id", propertyId)
    .single();

  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 });
  }

  const { data: userProfile } = await supabase
    .from("user_profiles")
    .select("is_admin")
    .eq("id", userId)
    .single();

  if (property.owner_id !== userId && !userProfile?.is_admin) {
    return NextResponse.json(
      { error: "You can only delete your own properties" },
      { status: 403 },
    );
  }

  const { error } = await supabase
    .from("properties")
    .delete()
    .eq("id", propertyId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  revalidatePath("/");
  revalidatePath("/my-properties");

  return NextResponse.json({ success: true });
}
