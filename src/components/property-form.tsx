"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Property } from "@/lib/supabase/types";

interface PropertyFormProps {
  property?: Property;
}

function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

export function PropertyForm({ property }: PropertyFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(property?.image_url || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const pricePerNight = Number(formData.get("pricePerNight"));
    const imageUrlValue = formData.get("imageUrl") as string;

    try {
      if (property) {
        const response = await fetch(`/api/properties/${property.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            description,
            location,
            pricePerNight,
            imageUrl: imageUrlValue || null,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to update property");
          setLoading(false);
          return;
        }

        router.push(`/properties/${property.id}`);
        router.refresh();
      } else {
        const response = await fetch("/api/properties", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            description,
            location,
            pricePerNight,
            imageUrl: imageUrlValue || null,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to create property");
          setLoading(false);
          return;
        }

        router.push(`/properties/${data.propertyId}`);
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800">
        <h2 className="text-lg font-medium">
          {property ? "Edit property" : "Property details"}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {property
            ? "Update your property information"
            : "Fill in the details about your property"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-900/30">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          {imageUrl && isValidUrl(imageUrl) && (
            <div className="mt-2 relative aspect-video w-full max-w-xs rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800">
              <Image
                src={imageUrl}
                alt="Preview"
                fill
                className="object-cover"
                onError={() => setImageUrl("")}
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">
            Property name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={property?.name}
            placeholder="Beach house"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            Description <span className="text-red-500">*</span>
          </Label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            defaultValue={property?.description}
            className="w-full px-3 py-2 text-sm border border-input rounded-md bg-transparent placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            placeholder="Describe your property..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">
            Location <span className="text-red-500">*</span>
          </Label>
          <Input
            id="location"
            name="location"
            type="text"
            required
            defaultValue={property?.location}
            placeholder="Stockholm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pricePerNight">
            Price per night ($) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="pricePerNight"
            name="pricePerNight"
            type="number"
            min="1"
            required
            defaultValue={property?.price_per_night}
            placeholder="100"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin w-4 h-4"
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
                {property ? "Updating..." : "Creating..."}
              </span>
            ) : property ? (
              "Update property"
            ) : (
              "Create property"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
