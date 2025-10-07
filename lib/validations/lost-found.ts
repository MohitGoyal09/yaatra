import { z } from "zod";

export const lostFoundItemSchema = z.object({
  type: z.enum(["lost", "found"], {
    message: "Please select whether this is a lost or found item",
  }),
  category: z.enum(["person", "pet", "item", "document", "other"], {
    message: "Please select a category",
  }),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters")
    .trim(),
  location: z
    .string()
    .min(3, "Location must be at least 3 characters")
    .max(200, "Location must be less than 200 characters")
    .trim(),
  locationData: z
    .object({
      address: z.string().min(3, "Address is required"),
      coordinates: z
        .object({
          lat: z.number().min(-90).max(90),
          lng: z.number().min(-180).max(180),
        })
        .optional(),
      placeName: z.string().optional(),
    })
    .optional(),
  locationCoordinates: z
    .object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    })
    .optional(),
  contactName: z
    .string()
    .min(2, "Contact name must be at least 2 characters")
    .max(100, "Contact name must be less than 100 characters")
    .trim(),
  contactPhone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"),
  contactEmail: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  contactAddress: z
    .string()
    .max(500, "Address must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  imageFile: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "File size must be less than 5MB"
    )
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type
        ),
      "Only JPEG, PNG, and WebP images are allowed"
    )
    .optional(),
  imageUrl: z
    .string()
    .url("Please enter a valid image URL")
    .optional()
    .or(z.literal("")),
});

export type LostFoundItemFormData = z.infer<typeof lostFoundItemSchema>;

export const searchSchema = z.object({
  search: z.string(),
  type: z.enum(["all", "lost", "found"]),
  category: z.enum(["all", "person", "pet", "item", "document", "other"]),
  location: z.string(),
});

export type SearchFormData = z.infer<typeof searchSchema>;
