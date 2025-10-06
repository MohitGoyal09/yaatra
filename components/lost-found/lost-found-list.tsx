"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MapPin,
  Clock,
  User,
  Phone,
  Mail,
  Home,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { formatDistanceToNow } from "@/lib/date-utils";

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

interface LostFoundListProps {
  items: LostFoundItem[];
  onViewItem?: (item: LostFoundItem) => void;
  onEditItem?: (item: LostFoundItem) => void;
  onDeleteItem?: (item: LostFoundItem) => void;
  currentUserId?: string;
}

export function LostFoundList({
  items,
  onViewItem,
  onEditItem,
  onDeleteItem,
  currentUserId,
}: LostFoundListProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-500";
      case "resolved":
        return "bg-green-500";
      case "closed":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "resolved":
        return "Resolved";
      case "closed":
        return "Closed";
      default:
        return "Unknown";
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          No items found
        </h3>
        <p className="text-muted-foreground">
          Try adjusting your search criteria or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const isExpanded = expandedItems.has(item.id);
        const isOwner = currentUserId === item.user.id;

        return (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {item.user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{item.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {item.user.totalPunyaPoints} pts
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(item.created_at), {
                        addSuffix: true,
                      })}
                      <span>•</span>
                      <span>by {item.user.name || "Anonymous"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`text-xs ${getTypeColor(item.type)} text-white`}
                  >
                    {getTypeLabel(item.type)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {getCategoryIcon(item.category)} {item.category}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-xs ${getStatusColor(
                      item.status
                    )} text-white`}
                  >
                    {getStatusLabel(item.status)}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Description */}
              <div>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {item.description}
                </p>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{item.location}</span>
              </div>

              {/* Image */}
              {item.image_url && (
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}

              {/* Contact Information (Expanded) */}
              {isExpanded && (
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm">Contact Information:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{item.contact_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`tel:${item.contact_phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {item.contact_phone}
                      </a>
                    </div>
                    {item.contact_email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`mailto:${item.contact_email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {item.contact_email}
                        </a>
                      </div>
                    )}
                    {item.contact_address && (
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4 text-muted-foreground" />
                        <span>{item.contact_address}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(item.id)}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  {isExpanded ? "Show Less" : "View Details"}
                </Button>

                {isOwner && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditItem?.(item)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteItem?.(item)}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
