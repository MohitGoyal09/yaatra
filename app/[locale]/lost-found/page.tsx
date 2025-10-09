"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LostFoundForm } from "@/components/lost-found/lost-found-form";
import { LostFoundList } from "@/components/lost-found/lost-found-list";
import { SearchFilter } from "@/components/lost-found/search-filter";
import {
  Plus,
  Search,
  AlertCircle,
  CheckCircle,
  Users,
  MapPin,
  Clock,
} from "lucide-react";
import { type LostFoundItemFormData } from "@/lib/validations/lost-found";
import { type SearchFormData } from "@/lib/validations/lost-found";
import { useUser } from "@clerk/nextjs";

interface LostFoundItem {
  id: string;
  type: "lost" | "found";
  category: string;
  name: string;
  description: string;
  location: string;
  contact_name: string;
  contact_phone: string;
  contact_email?: string;
  contact_address?: string;
  image_url?: string;
  status: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    name: string;
    totalPunyaPoints: number;
  };
}

export default function LostFoundPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("browse");
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFormData>({
    search: "",
    type: "all",
    category: "all",
    location: "",
  });

  // Load items on component mount and when filters change
  useEffect(() => {
    loadItems();
  }, [searchFilters]);

  const loadItems = async () => {
    console.log("🔄 [DEBUG] loadItems() started");
    console.log("🔍 [DEBUG] Current search filters:", searchFilters);

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchFilters.search) params.append("search", searchFilters.search);
      if (searchFilters.type !== "all")
        params.append("type", searchFilters.type);
      if (searchFilters.category !== "all")
        params.append("category", searchFilters.category);
      if (searchFilters.location)
        params.append("location", searchFilters.location);

      const url = `/api/lost-found?${params.toString()}`;
      console.log("🌐 [DEBUG] Making GET request to:", url);
      console.log(
        "📋 [DEBUG] Request params:",
        Object.fromEntries(params.entries())
      );

      const response = await fetch(url);

      console.log("📥 [DEBUG] Response received:");
      console.log("  - Status:", response.status, response.statusText);
      console.log(
        "  - Headers:",
        Object.fromEntries(response.headers.entries())
      );
      console.log("  - OK:", response.ok);
      console.log("  - URL:", response.url);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ [DEBUG] API Error Response:", errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("📊 [DEBUG] Parsed JSON response:", data);

      if (data.success) {
        console.log(
          "✅ [DEBUG] Success - Setting items:",
          data.items?.length || 0,
          "items"
        );
        setItems(data.items);
      } else {
        console.error("❌ [DEBUG] API returned error:", data.error);
        console.log("📋 [DEBUG] Error details:", data);
        setItems([]); // Set empty array on error
      }
    } catch (error) {
      console.error("💥 [DEBUG] Error loading items:", error);
      console.error(
        "💥 [DEBUG] Error stack:",
        error instanceof Error ? error.stack : "No stack trace"
      );
    } finally {
      console.log("🏁 [DEBUG] loadItems() finished");
      setLoading(false);
    }
  };

  const handleSubmitForm = async (formData: LostFoundItemFormData) => {
    console.log("🚀 [DEBUG] Form submission started");
    console.log("📝 [DEBUG] Form data received:", formData);

    setSubmitting(true);
    try {
      const requestBody = {
        type: formData.type,
        category: formData.category,
        name: formData.name,
        description: formData.description,
        location: formData.location,
        contactName: formData.contactName,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        contactAddress: formData.contactAddress,
        imageUrl: formData.imageUrl,
        locationData: formData.locationData,
        locationCoordinates: formData.locationCoordinates,
      };

      console.log("📤 [DEBUG] Request body being sent:", requestBody);
      console.log("🌐 [DEBUG] Making POST API call to: /api/lost-found");
      console.log(
        "🔑 [DEBUG] User authentication status:",
        user ? "Authenticated" : "Not authenticated"
      );
      console.log("👤 [DEBUG] User ID:", user?.id);

      const response = await fetch("/api/lost-found", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("📥 [DEBUG] Response received:");
      console.log("  - Status:", response.status, response.statusText);
      console.log(
        "  - Headers:",
        Object.fromEntries(response.headers.entries())
      );
      console.log("  - OK:", response.ok);
      console.log("  - URL:", response.url);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ [DEBUG] API Error Response:", errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("📊 [DEBUG] Parsed JSON response:", data);

      if (data.success) {
        console.log("✅ [DEBUG] Item created successfully:", data.item);
        console.log("🎯 [DEBUG] Points awarded:", data.pointsAwarded);
        alert(
          `Item reported successfully! You earned ${data.pointsAwarded} points.`
        );

        // Reset the form by switching to browse tab
        setActiveTab("browse");

        // Reload items to show the new one
        loadItems();
      } else {
        console.error("❌ [DEBUG] API returned error:", data.error);
        console.log("📋 [DEBUG] Error details:", data);
        alert(
          `Error: ${data.error}${data.details ? ` - ${data.details}` : ""}`
        );
      }
    } catch (error: any) {
      console.error("💥 [DEBUG] Network/parsing error:", error);
      console.error("💥 [DEBUG] Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      alert(`Error submitting item: ${error.message || "Unknown error"}`);
    } finally {
      console.log("🏁 [DEBUG] Form submission finished");
      setSubmitting(false);
    }
  };

  const handleSearch = (filters: SearchFormData) => {
    setSearchFilters(filters);
  };

  const handleEditItem = (item: LostFoundItem) => {
    // TODO: Implement edit functionality
    console.log("Edit item:", item);
  };

  const handleDeleteItem = async (item: LostFoundItem) => {
    console.log("🗑️ [DEBUG] Delete item requested for:", item.id, item.name);

    if (!confirm("Are you sure you want to delete this item?")) {
      console.log("❌ [DEBUG] User cancelled deletion");
      return;
    }

    try {
      const url = `/api/lost-found/${item.id}`;
      console.log("🌐 [DEBUG] Making DELETE request to:", url);
      console.log(
        "🔑 [DEBUG] User authentication status:",
        user ? "Authenticated" : "Not authenticated"
      );
      console.log("👤 [DEBUG] User ID:", user?.id);

      const response = await fetch(url, {
        method: "DELETE",
      });

      console.log("📥 [DEBUG] Delete response received:");
      console.log("  - Status:", response.status, response.statusText);
      console.log(
        "  - Headers:",
        Object.fromEntries(response.headers.entries())
      );
      console.log("  - OK:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ [DEBUG] API Error Response:", errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("📊 [DEBUG] Delete response data:", data);

      if (data.success) {
        console.log("✅ [DEBUG] Item deleted successfully, removing from list");
        // Remove the item from the list
        setItems((prev) => prev.filter((i) => i.id !== item.id));
        alert("Item deleted successfully");
      } else {
        console.error("❌ [DEBUG] Failed to delete item:", data.error);
        console.log("📋 [DEBUG] Error details:", data);
        alert("Failed to delete item. Please try again.");
      }
    } catch (error) {
      console.error("💥 [DEBUG] Error deleting item:", error);
      console.error(
        "💥 [DEBUG] Error stack:",
        error instanceof Error ? error.stack : "No stack trace"
      );
      alert("Error deleting item. Please try again.");
    }
  };

  // Filter items by type for display
  const lostItems = items.filter((item) => item.type === "lost");
  const foundItems = items.filter((item) => item.type === "found");

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <div
        className="fixed inset-0 bg-cover bg-center opacity-20 z-0"
        style={{ backgroundImage: `url('/lost.jpg')` }}
      ></div>
      <div className="relative z-10">
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Lost & Found</h1>
              <p className="text-muted-foreground">
                Help reunite lost items with their owners. Report lost or found
                items in the community.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-full">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{lostItems.length}</p>
                      <p className="text-sm text-muted-foreground">
                        Lost Items
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{foundItems.length}</p>
                      <p className="text-sm text-muted-foreground">
                        Found Items
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{items.length}</p>
                      <p className="text-sm text-muted-foreground">
                        Total Reports
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {
                          items.filter((item) => item.status === "resolved")
                            .length
                        }
                      </p>
                      <p className="text-sm text-muted-foreground">Resolved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="browse" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Browse Items
                </TabsTrigger>
                <TabsTrigger value="report" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Report Item
                </TabsTrigger>
                <TabsTrigger
                  value="my-items"
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  My Items
                </TabsTrigger>
              </TabsList>

              {/* Browse Items Tab */}
              <TabsContent value="browse" className="space-y-6">
                <SearchFilter
                  onSearch={handleSearch}
                  isLoading={loading}
                  initialFilters={searchFilters}
                />

                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : (
                  <LostFoundList
                    items={items}
                    onEditItem={handleEditItem}
                    onDeleteItem={handleDeleteItem}
                    currentUserId={user?.id}
                  />
                )}
              </TabsContent>

              {/* Report Item Tab */}
              <TabsContent value="report">
                <LostFoundForm
                  onSubmit={handleSubmitForm}
                  isLoading={submitting}
                />
              </TabsContent>

              {/* My Items Tab */}
              <TabsContent value="my-items" className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">My Reported Items</h2>
                  <p className="text-muted-foreground">
                    Items you have reported as lost or found
                  </p>
                </div>

                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : (
                  <LostFoundList
                    items={items.filter((item) => item.user.id === user?.id)}
                    onEditItem={handleEditItem}
                    onDeleteItem={handleDeleteItem}
                    currentUserId={user?.id}
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

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
                    <a
                      href="/about"
                      className="text-green-100 hover:text-white transition-colors"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="/services"
                      className="text-green-100 hover:text-white transition-colors"
                    >
                      Services
                    </a>
                  </li>
                  <li>
                    <a
                      href="/contact"
                      className="text-green-100 hover:text-white transition-colors"
                    >
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="/faq"
                      className="text-green-100 hover:text-white transition-colors"
                    >
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a
                      href="/guide"
                      className="text-green-100 hover:text-white transition-colors"
                    >
                      Travel Guide
                    </a>
                  </li>
                  <li>
                    <a
                      href="/emergency"
                      className="text-green-100 hover:text-white transition-colors"
                    >
                      Emergency
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="/privacy"
                      className="text-green-100 hover:text-white transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="/terms"
                      className="text-green-100 hover:text-white transition-colors"
                    >
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
