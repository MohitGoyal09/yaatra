import { z } from "zod";

export const crimeReportSchema = z.object({
  crime_type: z.enum(["theft", "vandalism", "assault", "fraud", "other"], {
    message: "Please select a crime type",
  }),
  severity: z.enum(["low", "medium", "high", "critical"], {
    message: "Please select severity level",
  }),
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
  incident_date: z.string().optional(),
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
  is_anonymous: z.boolean().default(false),
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
});

export type CrimeReportFormData = z.infer<typeof crimeReportSchema>;
