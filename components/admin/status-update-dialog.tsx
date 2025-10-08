
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface StatusUpdateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: string;
  itemId: string;
  itemType: "lostFound" | "crimeReport";
  onStatusUpdated: () => void;
}

export function StatusUpdateDialog({
  isOpen,
  onClose,
  currentStatus,
  itemId,
  itemType,
  onStatusUpdated,
}: StatusUpdateDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const lostFoundStatuses = ["pending", "active", "resolved", "closed"];
  const crimeReportStatuses = ["reported", "investigating", "resolved", "closed"];
  
  const statuses = itemType === "lostFound" ? lostFoundStatuses : crimeReportStatuses;

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const endpoint = itemType === "lostFound" 
        ? `/api/admin/lost-found/${itemId}`
        : `/api/admin/crime-reports/${itemId}`;

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: selectedStatus }),
      });

      const data = await response.json();

      if (data.success) {
        onStatusUpdated();
        onClose();
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Status</DialogTitle>
          <DialogDescription>
            Change the status of this {itemType === "lostFound" ? "lost/found item" : "crime report"}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isUpdating}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={isUpdating}>
            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}