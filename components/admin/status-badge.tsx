
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
  type: "lostFound" | "crimeReport";
}

export function StatusBadge({ status, type }: StatusBadgeProps) {
  const getStatusColor = () => {
    switch (status) {
      case "pending":
      case "reported":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "active":
      case "investigating":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "resolved":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "closed":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <Badge className={getStatusColor()} variant="secondary">
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}