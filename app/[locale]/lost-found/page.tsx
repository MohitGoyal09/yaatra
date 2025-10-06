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

      const response = await fetch(`/api/lost-found?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setItems(data.items);
      } else {
        console.error("Failed to load items:", data.error);
      }
    } catch (error) {
      console.error("Error loading items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForm = async (formData: LostFoundItemFormData) => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/lost-found", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
          locationCoordinates: formData.locationCoordinates,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Add the new item to the list
        setItems((prev) => [data.item, ...prev]);
        // Switch to browse tab to show the new item
        setActiveTab("browse");
        // Show success message (you can add a toast here)
        alert("Item submitted successfully! +10 points awarded");
      } else {
        console.error("Failed to submit item:", data.error);
        alert("Failed to submit item. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting item:", error);
      alert("Error submitting item. Please try again.");
    } finally {
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
    if (!confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      const response = await fetch(`/api/lost-found/${item.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        // Remove the item from the list
        setItems((prev) => prev.filter((i) => i.id !== item.id));
        alert("Item deleted successfully");
      } else {
        console.error("Failed to delete item:", data.error);
        alert("Failed to delete item. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Error deleting item. Please try again.");
    }
  };

  // Filter items by type for display
  const lostItems = items.filter((item) => item.type === "lost");
  const foundItems = items.filter((item) => item.type === "found");

  return (
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
                  <p className="text-sm text-muted-foreground">Lost Items</p>
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
                  <p className="text-sm text-muted-foreground">Found Items</p>
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
                  <p className="text-sm text-muted-foreground">Total Reports</p>
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
                    {items.filter((item) => item.status === "resolved").length}
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
            <TabsTrigger value="my-items" className="flex items-center gap-2">
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
            <LostFoundForm onSubmit={handleSubmitForm} isLoading={submitting} />
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
  );
}
