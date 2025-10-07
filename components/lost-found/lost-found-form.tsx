"use client";

import React, { useState, useRef, useEffect } from "react";
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
  X,
} from "lucide-react";
import {
  lostFoundItemSchema,
  type LostFoundItemFormData,
} from "@/lib/validations/lost-found";
import { LocationPicker, type LocationData } from "./location-picker";

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [locationData, setLocationData] = useState<LocationData>({
    address: initialData?.location || "",
    coordinates: initialData?.locationData?.coordinates,
    placeName: initialData?.locationData?.placeName,
  });
  const [isAutoCapturingLocation, setIsAutoCapturingLocation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValue("imageFile", file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setValue("imageFile", undefined);
    setValue("imageUrl", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Auto-capture location when form loads (only for new items)
  useEffect(() => {
    if (
      mode === "create" &&
      !locationData.coordinates &&
      navigator.geolocation
    ) {
      setIsAutoCapturingLocation(true);
      // Auto-request location permission and capture coordinates
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Reverse geocoding to get address
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${
                process.env.NEXT_PUBLIC_OPENCAGE_API_KEY || "demo"
              }`
            );

            if (response.ok) {
              const data = await response.json();
              const address =
                data.results[0]?.formatted ||
                `Near coordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(
                  6
                )}`;

              const newLocationData = {
                address,
                coordinates: { lat: latitude, lng: longitude },
                placeName: data.results[0]?.components?.city || "Ujjain",
              };

              setLocationData(newLocationData);
              setValue("location", address);
              setValue("locationData", newLocationData);
              setValue("locationCoordinates", newLocationData.coordinates);
            } else {
              // Fallback if reverse geocoding fails
              const address = `Near coordinates: ${latitude.toFixed(
                6
              )}, ${longitude.toFixed(6)}`;
              const newLocationData = {
                address,
                coordinates: { lat: latitude, lng: longitude },
                placeName: "Ujjain",
              };

              setLocationData(newLocationData);
              setValue("location", address);
              setValue("locationData", newLocationData);
              setValue("locationCoordinates", newLocationData.coordinates);
            }
          } catch (error) {
            // Fallback if API fails
            const address = `Near coordinates: ${latitude.toFixed(
              6
            )}, ${longitude.toFixed(6)}`;
            const newLocationData = {
              address,
              coordinates: { lat: latitude, lng: longitude },
              placeName: "Ujjain",
            };

            setLocationData(newLocationData);
            setValue("location", address);
            setValue("locationData", newLocationData);
            setValue("locationCoordinates", newLocationData.coordinates);
          }

          setIsAutoCapturingLocation(false);
        },
        (error) => {
          // Silently fail for auto-capture - user can manually get location
          console.log("Auto location capture failed:", error.message);
          setIsAutoCapturingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 300000, // 5 minutes
        }
      );
    }
  }, [mode, setValue, locationData.coordinates]);

  const testAPI = async () => {
    console.log("🧪 Testing simple API...");
    try {
      const response = await fetch("/api/test-lost-found", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("🧪 Test API response status:", response.status);
      const data = await response.json();
      console.log("🧪 Test API response data:", data);
      alert("Test API working! Check console for details.");
    } catch (error) {
      console.error("🧪 Test API error:", error);
      alert("Test API failed! Check console for details.");
    }
  };

  const onSubmitForm = async (data: LostFoundItemFormData) => {
    console.log("📋 Form onSubmitForm called with data:", data);
    console.log("🔍 Form data breakdown:", {
      type: data.type,
      category: data.category,
      name: data.name,
      description: data.description,
      location: data.location,
      locationData: data.locationData,
      locationCoordinates: data.locationCoordinates,
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      contactEmail: data.contactEmail,
      contactAddress: data.contactAddress,
      imageUrl: data.imageUrl,
      imageFile: data.imageFile,
    });
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
            {/* <Label>Location *</Label> */}

            {/* Auto-capture notification */}
            {isAutoCapturingLocation && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <p className="text-sm text-blue-600">
                  Automatically capturing your current location...
                </p>
              </div>
            )}

            <LocationPicker
              value={locationData}
              onChange={(location) => {
                setLocationData(location);
                setValue("location", location.address);
                setValue("locationData", location);
                setValue("locationCoordinates", location.coordinates);
              }}
              error={errors.location?.message}
            />
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

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="imageFile">Upload Image (Optional)</Label>

            {/* File Input */}
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                id="imageFile"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload image file"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full justify-start gap-2"
              >
                <Upload className="h-4 w-4" />
                {selectedFile ? selectedFile.name : "Choose an image"}
              </Button>
            </div>

            {/* Alternative: Image URL */}
            <div className="relative">
              <Camera className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="imageUrl"
                {...register("imageUrl")}
                placeholder="Or enter image URL (https://example.com/image.jpg)"
                className={`pl-10 ${errors.imageUrl ? "border-red-500" : ""}`}
                onChange={(e) => handleImageUrlChange(e.target.value)}
              />
            </div>

            {/* Error Messages */}
            {errors.imageFile && (
              <p className="text-sm text-red-500">{errors.imageFile.message}</p>
            )}
            {errors.imageUrl && (
              <p className="text-sm text-red-500">{errors.imageUrl.message}</p>
            )}

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-2 relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border"
                  onError={() => setImagePreview(null)}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
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

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={testAPI}
                className="min-w-[100px]"
              >
                Test API
              </Button>
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
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
