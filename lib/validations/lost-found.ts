import { z } from "zod";

export const lostFoundItemSchema = z.object({
  type: z.enum(["lost", "found"], {
    required_error: "Please select whether this is a lost or found item",
  }),
  category: z.enum(["person", "pet", "item", "document", "other"], {
    required_error: "Please select a category",
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
  imageUrl: z
    .string()
    .url("Please enter a valid image URL")
    .optional()
    .or(z.literal("")),
  locationCoordinates: z
    .object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180),
    })
    .optional(),
});

export type LostFoundItemFormData = z.infer<typeof lostFoundItemSchema>;

export const searchSchema = z.object({
  search: z.string().optional(),
  type: z.enum(["all", "lost", "found"]).default("all"),
  category: z
    .enum(["all", "person", "pet", "item", "document", "other"])
    .default("all"),
  location: z.string().optional(),
});

export type SearchFormData = z.infer<typeof searchSchema>;
