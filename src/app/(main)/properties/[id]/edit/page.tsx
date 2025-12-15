import { notFound, redirect } from "next/navigation";
import { PropertyForm } from "@/components/property-form";
import { createClient, getUser } from "@/lib/supabase/server";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: property, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !property) {
    notFound();
  }

  if (property.owner_id !== user.id) {
    redirect(`/properties/${id}`);
  }

  return (
    <div className="min-h-dvh bg-gray-50 dark:bg-zinc-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Property
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Update your property details to attract more guests
          </p>
        </div>

        <PropertyForm property={property} />
      </div>
    </div>
  );
}
