"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Plus, Shield, MapPin, Phone, Mail, Clock, Eye } from "lucide-react";
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
        setActiveTab("browse");
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
    <div className="min-h-screen bg-background text-foreground relative">
      <div
        className="fixed inset-0 bg-cover bg-center opacity-20 z-0"
        style={{ backgroundImage: `url('/crime_report.jpg')` }}
      ></div>
      <div className="relative z-10">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-12 mb-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-16 w-16 mr-4" />
              <div>
                <h1 className="text-4xl font-bold mb-2">Community Safety Reports</h1>
                <p className="text-white/90 text-lg">
                  Report crimes and help keep our community safe. All reports are taken seriously.
                </p>
              </div>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 pb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="browse" className="flex items-center gap-2 text-lg py-3">
                <Eye className="h-5 w-5" />
                Browse Reports
              </TabsTrigger>
              <TabsTrigger value="report" className="flex items-center gap-2 text-lg py-3">
                <Plus className="h-5 w-5" />
                Report Crime
              </TabsTrigger>
            </TabsList>

            <TabsContent value="browse">
              <div className="space-y-6">
                {loading ? (
                  <Card className="border-border">
                    <CardContent className="flex items-center justify-center py-16">
                      <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
                        <span className="text-lg text-muted-foreground">Loading reports...</span>
                      </div>
                    </CardContent>
                  </Card>
                ) : reports.length === 0 ? (
                  <Card className="border-border shadow-lg ">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                      <div className="bg-muted rounded-full mb-6 ">
                        <Shield className="h-16 w-16 text-muted-foreground" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-3">
                        No Crime Reports Yet
                      </h3>
                      <p className="text-muted-foreground text-center mb-6 max-w-md">
                        Be the first to help make our community safer by reporting any incidents.
                      </p>
                      <Button
                        onClick={() => setActiveTab("report")}
                        className="bg-primary hover:bg-primary/90 text-lg px-8 py-3"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Report a Crime
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6">
                    {reports.map((report) => (
                      <Card
                        key={report.id}
                        className="border-border hover:shadow-xl transition-all duration-300"
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                              <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-lg">
                                <div className="text-4xl">
                                  {getCrimeTypeIcon(report.crime_type)}
                                </div>
                              </div>
                              <div>
                                <CardTitle className="text-2xl capitalize mb-2">
                                  {report.crime_type.replace("_", " ")}
                                </CardTitle>
                                <div className="flex items-center gap-3">
                                  <Badge
                                    className={`${getSeverityColor(report.severity)} px-3 py-1 text-sm font-semibold`}
                                  >
                                    {report.severity.toUpperCase()}
                                  </Badge>
                                  <Badge variant="outline" className="px-3 py-1 text-sm">
                                    {report.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <Clock className="h-4 w-4" />
                                <span className="text-sm">
                                  {new Date(report.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {new Date(report.created_at).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="bg-muted/50 rounded-lg p-4 mb-4">
                            <p className="text-foreground leading-relaxed">{report.description}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center gap-3 p-3 bg-card rounded-lg border">
                              <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                              <div>
                                <p className="text-xs text-muted-foreground">Location</p>
                                <p className="text-sm font-medium text-foreground">{report.location}</p>
                              </div>
                            </div>

                            {report.incident_date && (
                              <div className="flex items-center gap-3 p-3 bg-card rounded-lg border">
                                <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Incident Date</p>
                                  <p className="text-sm font-medium text-foreground">
                                    {new Date(report.incident_date).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            )}

                            {!report.is_anonymous && (
                              <>
                                <div className="flex items-center gap-3 p-3 bg-card rounded-lg border">
                                  <Phone className="h-5 w-5 text-green-500 flex-shrink-0" />
                                  <div>
                                    <p className="text-xs text-muted-foreground">Contact Phone</p>
                                    <p className="text-sm font-medium text-foreground">
                                      {report.contact_phone}
                                    </p>
                                  </div>
                                </div>

                                {report.contact_email && (
                                  <div className="flex items-center gap-3 p-3 bg-card rounded-lg border">
                                    <Mail className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Contact Email</p>
                                      <p className="text-sm font-medium text-foreground">
                                        {report.contact_email}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          </div>

                          {report.image_url && (
                            <div className="mt-4">
                              <p className="text-sm font-semibold text-muted-foreground mb-2">Evidence Photo:</p>
                              <img
                                src={report.image_url}
                                alt="Evidence"
                                className="w-full max-h-96 object-cover rounded-lg shadow-md"
                              />
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="report">
              <Card className="border-border shadow-lg">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 items-center">
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <Shield className="h-7 w-7 text-primary" />
                    Submit Crime Report
                  </CardTitle>
                  <p className="text-muted-foreground mt-2">
                    Fill out the form below to report a crime. Your report helps keep our community safe.
                  </p>
                </CardHeader>
                <CardContent className="pt-6">
                  <CrimeReportForm
                    onSubmit={handleSubmitReport}
                    isLoading={submitting}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        <footer className="relative z-10 bg-gradient-to-r from-primary/90 to-secondary/90 text-primary-foreground py-12 lg:py-16 w-full">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-4">YaatraSarthi</h3>
                <p className="text-green-100">
                  Your trusted companion for spiritual journeys in Ujjain
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="/about" className="text-green-100 hover:text-white transition-colors">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="/services" className="text-green-100 hover:text-white transition-colors">
                      Services
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="text-green-100 hover:text-white transition-colors">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="/faq" className="text-green-100 hover:text-white transition-colors">
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a href="/guide" className="text-green-100 hover:text-white transition-colors">
                      Travel Guide
                    </a>
                  </li>
                  <li>
                    <a href="/emergency" className="text-green-100 hover:text-white transition-colors">
                      Emergency
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="/privacy" className="text-green-100 hover:text-white transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="/terms" className="text-green-100 hover:text-white transition-colors">
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-green-600 pt-8 text-center text-green-100">
              <p>&copy; 2025 YaatraSarthi. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
