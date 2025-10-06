"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  MapPin,
  User,
  Phone,
  Mail,
  Home,
  Camera,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  lostFoundItemSchema,
  type LostFoundItemFormData,
} from "@/lib/validations/lost-found";

interface LostFoundFormProps {
  onSubmit: (data: LostFoundItemFormData) => Promise<void>;
  isLoading?: boolean;
  initialData?: Partial<LostFoundItemFormData>;
  mode?: "create" | "edit";
}

export function LostFoundForm({
  onSubmit,
  isLoading = false,
  initialData,
  mode = "create",
}: LostFoundFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imageUrl || null
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<LostFoundItemFormData>({
    resolver: zodResolver(lostFoundItemSchema),
    defaultValues: {
      type: initialData?.type || "lost",
      category: initialData?.category || "item",
      name: initialData?.name || "",
      description: initialData?.description || "",
      location: initialData?.location || "",
      contactName: initialData?.contactName || "",
      contactPhone: initialData?.contactPhone || "",
      contactEmail: initialData?.contactEmail || "",
      contactAddress: initialData?.contactAddress || "",
      imageUrl: initialData?.imageUrl || "",
    },
    mode: "onChange",
  });

  const watchedType = watch("type");
  const watchedCategory = watch("category");

  const handleImageUrlChange = (url: string) => {
    setValue("imageUrl", url);
    setImagePreview(url);
  };

  const onSubmitForm = async (data: LostFoundItemFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const getTypeColor = (type: string) => {
    return type === "lost" ? "bg-red-500" : "bg-green-500";
  };

  const getTypeLabel = (type: string) => {
    return type === "lost" ? "Lost" : "Found";
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "person":
        return <User className="h-4 w-4" />;
      case "pet":
        return "🐕";
      case "item":
        return "📦";
      case "document":
        return "📄";
      default:
        return "❓";
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {mode === "create" ? (
            <>
              <AlertCircle className="h-5 w-5" />
              Report {watchedType === "lost" ? "Lost" : "Found"} Item
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5" />
              Edit Item
            </>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          {/* Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <Select
              value={watchedType}
              onValueChange={(value) =>
                setValue("type", value as "lost" | "found")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lost">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    Lost
                  </div>
                </SelectItem>
                <SelectItem value="found">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    Found
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={watchedCategory}
              onValueChange={(value) => setValue("category", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="person">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Person
                  </div>
                </SelectItem>
                <SelectItem value="pet">
                  <div className="flex items-center gap-2">
                    <span>🐕</span>
                    Pet
                  </div>
                </SelectItem>
                <SelectItem value="item">
                  <div className="flex items-center gap-2">
                    <span>📦</span>
                    Item
                  </div>
                </SelectItem>
                <SelectItem value="document">
                  <div className="flex items-center gap-2">
                    <span>📄</span>
                    Document
                  </div>
                </SelectItem>
                <SelectItem value="other">
                  <div className="flex items-center gap-2">
                    <span>❓</span>
                    Other
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name/Title *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter the name or title of the item"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Provide a detailed description of the item, including any distinguishing features, colors, size, etc."
              className={`min-h-[100px] ${
                errors.description ? "border-red-500" : ""
              }`}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                {...register("location")}
                placeholder="Where was it lost/found? (e.g., Near Mahakal Temple, Ujjain)"
                className={`pl-10 ${errors.location ? "border-red-500" : ""}`}
              />
            </div>
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location.message}</p>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>

            {/* Contact Name */}
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contactName"
                  {...register("contactName")}
                  placeholder="Your full name"
                  className={`pl-10 ${
                    errors.contactName ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.contactName && (
                <p className="text-sm text-red-500">
                  {errors.contactName.message}
                </p>
              )}
            </div>

            {/* Contact Phone */}
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contactPhone"
                  {...register("contactPhone")}
                  placeholder="+91 9876543210"
                  className={`pl-10 ${
                    errors.contactPhone ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.contactPhone && (
                <p className="text-sm text-red-500">
                  {errors.contactPhone.message}
                </p>
              )}
            </div>

            {/* Contact Email */}
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email (Optional)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contactEmail"
                  {...register("contactEmail")}
                  placeholder="your.email@example.com"
                  type="email"
                  className={`pl-10 ${
                    errors.contactEmail ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.contactEmail && (
                <p className="text-sm text-red-500">
                  {errors.contactEmail.message}
                </p>
              )}
            </div>

            {/* Contact Address */}
            <div className="space-y-2">
              <Label htmlFor="contactAddress">Address (Optional)</Label>
              <div className="relative">
                <Home className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="contactAddress"
                  {...register("contactAddress")}
                  placeholder="Your complete address"
                  className={`pl-10 min-h-[80px] ${
                    errors.contactAddress ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.contactAddress && (
                <p className="text-sm text-red-500">
                  {errors.contactAddress.message}
                </p>
              )}
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (Optional)</Label>
            <div className="relative">
              <Camera className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="imageUrl"
                {...register("imageUrl")}
                placeholder="https://example.com/image.jpg"
                className={`pl-10 ${errors.imageUrl ? "border-red-500" : ""}`}
                onChange={(e) => handleImageUrlChange(e.target.value)}
              />
            </div>
            {errors.imageUrl && (
              <p className="text-sm text-red-500">{errors.imageUrl.message}</p>
            )}

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border"
                  onError={() => setImagePreview(null)}
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getTypeColor(watchedType)}>
                {getTypeLabel(watchedType)}
              </Badge>
              <Badge variant="outline">
                {getCategoryIcon(watchedCategory)} {watchedCategory}
              </Badge>
            </div>

            <Button
              type="submit"
              disabled={!isValid || isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {mode === "create" ? "Submitting..." : "Updating..."}
                </div>
              ) : mode === "create" ? (
                "Submit Report"
              ) : (
                "Update Item"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
