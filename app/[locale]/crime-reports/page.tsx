"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Plus, Shield, MapPin, Phone, Mail } from "lucide-react";
import { CrimeReportForm } from "@/components/crime-report/crime-report-form";
import {
  crimeReportSchema,
  type CrimeReportFormData,
} from "@/lib/validations/crime-report";

interface CrimeReport {
  id: string;
  crime_type: string;
  severity: string;
  description: string;
  location: string;
  incident_date: string | null;
  contact_name: string;
  contact_phone: string;
  contact_email: string | null;
  contact_address: string | null;
  image_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  location_coordinates: any;
  is_anonymous: boolean;
  user: {
    id: string;
    name: string;
    totalPunyaPoints: number;
  };
}

export default function CrimeReportsPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("browse");
  const [reports, setReports] = useState<CrimeReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load crime reports
  const loadReports = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/crime-reports");
      const data = await response.json();

      if (data.success) {
        setReports(data.reports);
      } else {
        console.error("Failed to load crime reports:", data.error);
      }
    } catch (error) {
      console.error("Error loading crime reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleSubmitReport = async (formData: CrimeReportFormData) => {
    console.log("🚀 Crime report submission started");
    console.log("📝 Form data received:", formData);

    setSubmitting(true);
    try {
      const requestBody = {
        crime_type: formData.crime_type,
        severity: formData.severity,
        description: formData.description,
        location: formData.location,
        incident_date: formData.incident_date,
        contactName: formData.contactName,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        contactAddress: formData.contactAddress,
        imageUrl: formData.imageUrl,
        is_anonymous: formData.is_anonymous,
        locationData: formData.locationData,
        locationCoordinates: formData.locationCoordinates,
      };

      console.log("📤 Request body being sent:", requestBody);
      console.log("🌐 Making API call to: /api/crime-reports");

      const response = await fetch("/api/crime-reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📡 Response status:", response.status);
      console.log(
        "📡 Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      // Check if response is actually JSON
      const contentType = response.headers.get("content-type");
      console.log("📄 Content-Type:", contentType);

      if (!contentType || !contentType.includes("application/json")) {
        console.error("❌ Response is not JSON! Content-Type:", contentType);
        const textResponse = await response.text();
        console.error(
          "📄 HTML response:",
          textResponse.substring(0, 500) + "..."
        );
        throw new Error(
          `API returned ${response.status}: ${response.statusText}. Expected JSON but got ${contentType}`
        );
      }

      const data = await response.json();
      console.log("📦 Response data received:", data);

      if (data.success) {
        console.log("✅ Success! Report created:", data.report);
        // Add the new report to the list
        setReports((prev) => [data.report, ...prev]);
        // Switch to browse tab to show the new report
        setActiveTab("browse");
        // Show success message
        alert("Crime report submitted successfully! +15 points awarded");
      } else {
        console.error("❌ API returned error:", data.error);
        console.error("❌ Full error response:", data);
        alert(`Failed to submit report: ${data.error || "Unknown error"}`);
      }
    } catch (error: any) {
      console.error("💥 Network/parsing error:", error);
      console.error("💥 Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      alert(`Error submitting report: ${error.message || "Unknown error"}`);
    } finally {
      console.log("🏁 Crime report submission finished");
      setSubmitting(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-600 text-white";
      case "high":
        return "bg-orange-500 text-white";
      case "medium":
        return "bg-yellow-500 text-black";
      default:
        return "bg-gray-500 text-white";
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Community Safety Reports
        </h1>
        <p className="text-gray-600">
          Report crimes and help keep our community safe. All reports are taken
          seriously.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Browse Reports
          </TabsTrigger>
          <TabsTrigger value="report" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Report Crime
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="mt-6">
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Loading reports...</span>
              </div>
            ) : reports.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Shield className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Crime Reports Yet
                  </h3>
                  <p className="text-gray-600 text-center mb-4">
                    Be the first to help make our community safer by reporting
                    any incidents.
                  </p>
                  <Button onClick={() => setActiveTab("report")}>
                    Report a Crime
                  </Button>
                </CardContent>
              </Card>
            ) : (
              reports.map((report) => (
                <Card
                  key={report.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {getCrimeTypeIcon(report.crime_type)}
                        </div>
                        <div>
                          <CardTitle className="text-lg capitalize">
                            {report.crime_type.replace("_", " ")}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              className={getSeverityColor(report.severity)}
                            >
                              {report.severity}
                            </Badge>
                            <Badge variant="outline">{report.status}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        {new Date(report.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{report.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{report.location}</span>
                      </div>

                      {report.incident_date && (
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">
                            {new Date(report.incident_date).toLocaleString()}
                          </span>
                        </div>
                      )}

                      {!report.is_anonymous && (
                        <>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600">
                              {report.contact_phone}
                            </span>
                          </div>

                          {report.contact_email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-600">
                                {report.contact_email}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {report.image_url && (
                      <div className="mt-4">
                        <img
                          src={report.image_url}
                          alt="Evidence"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="report" className="mt-6">
          <CrimeReportForm
            onSubmit={handleSubmitReport}
            isLoading={submitting}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
