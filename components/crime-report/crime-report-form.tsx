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
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertTriangle,
  Shield,
  MapPin,
  User,
  Phone,
  Mail,
  Home,
  Camera,
  X,
  Upload,
} from "lucide-react";
import {
  crimeReportSchema,
  type CrimeReportFormData,
} from "@/lib/validations/crime-report";
import {
  LocationPicker,
  type LocationData,
} from "../lost-found/location-picker";

interface CrimeReportFormProps {
  onSubmit: (data: CrimeReportFormData) => Promise<void>;
  isLoading?: boolean;
  initialData?: Partial<CrimeReportFormData>;
  mode?: "create" | "edit";
}

export function CrimeReportForm({
  onSubmit,
  isLoading = false,
  initialData,
  mode = "create",
}: CrimeReportFormProps) {
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
    formState: { errors, isValid }
  } = useForm<CrimeReportFormData>({
    resolver: zodResolver(crimeReportSchema) as any,
    defaultValues: {
      crime_type: initialData?.crime_type || "theft",
      severity: initialData?.severity || "medium",
      description: initialData?.description || "",
      location: initialData?.location || "",
      incident_date: initialData?.incident_date || "",
      contactName: initialData?.contactName || "",
      contactPhone: initialData?.contactPhone || "",
      contactEmail: initialData?.contactEmail || "",
      contactAddress: initialData?.contactAddress || "",
      imageUrl: initialData?.imageUrl || "",
      is_anonymous: initialData?.is_anonymous || false,
    },
    mode: "onChange",
  });

  const watchedCrimeType = watch("crime_type");
  const watchedSeverity = watch("severity");
  const watchedIsAnonymous = watch("is_anonymous");

  // Auto-capture location when form loads (only for new reports)
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

  const handleImageUrlChange = (url: string) => {
    setValue("imageUrl", url);
    setImagePreview(url);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // setValue("imageFile", file); // Remove this line, as "imageFile" is not a valid field name

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
    // setValue("imageFile", undefined); // Remove this line, as "imageFile" is not a valid field name
    setValue("imageUrl", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmitForm = async (data: CrimeReportFormData) => {
    console.log("📋 Crime Report Form onSubmitForm called with data:", data);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-600";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getCrimeTypeIcon = (type: string) => {
    switch (type) {
      case "theft":
        return "👜";
      case "vandalism":
        return "🎨";
      case "assault":
        return "👊";
      case "fraud":
        return "💳";
      default:
        return "📋";
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {mode === "create" ? "Report Crime" : "Edit Crime Report"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          {/* Crime Type */}
          <div className="space-y-2">
            <Label htmlFor="crime_type">Crime Type *</Label>
            <Select
              value={watchedCrimeType}
              onValueChange={(value) => setValue("crime_type", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select crime type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="theft">
                  <div className="flex items-center gap-2">
                    <span>👜</span>
                    Theft
                  </div>
                </SelectItem>
                <SelectItem value="vandalism">
                  <div className="flex items-center gap-2">
                    <span>🎨</span>
                    Vandalism
                  </div>
                </SelectItem>
                <SelectItem value="assault">
                  <div className="flex items-center gap-2">
                    <span>👊</span>
                    Assault
                  </div>
                </SelectItem>
                <SelectItem value="fraud">
                  <div className="flex items-center gap-2">
                    <span>💳</span>
                    Fraud
                  </div>
                </SelectItem>
                <SelectItem value="other">
                  <div className="flex items-center gap-2">
                    <span>📋</span>
                    Other
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.crime_type && (
              <p className="text-sm text-red-500">
                {errors.crime_type.message}
              </p>
            )}
          </div>

          {/* Severity */}
          <div className="space-y-2">
            <Label htmlFor="severity">Severity Level *</Label>
            <Select
              value={watchedSeverity}
              onValueChange={(value) => setValue("severity", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                    Low
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    Medium
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    High
                  </div>
                </SelectItem>
                <SelectItem value="critical">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-600"></div>
                    Critical
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.severity && (
              <p className="text-sm text-red-500">{errors.severity.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Provide a detailed description of the incident..."
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

          {/* Incident Date */}
          <div className="space-y-2">
            <Label htmlFor="incident_date">Incident Date & Time</Label>
            <Input
              id="incident_date"
              type="datetime-local"
              {...register("incident_date")}
              className={errors.incident_date ? "border-red-500" : ""}
            />
            {errors.incident_date && (
              <p className="text-sm text-red-500">
                {errors.incident_date.message}
              </p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label>Location *</Label>

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

          {/* Anonymous Report */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_anonymous"
              checked={watchedIsAnonymous}
              onCheckedChange={(checked) => setValue("is_anonymous", !!checked)}
            />
            <Label htmlFor="is_anonymous" className="text-sm">
              Submit anonymously
            </Label>
          </div>

          {/* Contact Information (only if not anonymous) */}
          {!watchedIsAnonymous && (
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
          )}

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="imageFile">Upload Evidence Image (Optional)</Label>

            {/* File Input */}
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                id="imageFile"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload evidence image file"
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
              <Badge
                variant="outline"
                className={getSeverityColor(watchedSeverity)}
              >
                {watchedSeverity}
              </Badge>
              <Badge variant="outline">
                {getCrimeTypeIcon(watchedCrimeType)} {watchedCrimeType}
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
                "Update Report"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
