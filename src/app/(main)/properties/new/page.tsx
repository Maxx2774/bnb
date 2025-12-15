import { PropertyForm } from "@/components/property-form";

export default function NewPropertyPage() {
  return (
    <div className="min-h-dvh bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">List Your Property</h1>
          <p className="mt-2 text-muted-foreground">
            Share your space with travelers and earn extra income
          </p>
        </div>

        <PropertyForm />
      </div>
    </div>
  );
}
