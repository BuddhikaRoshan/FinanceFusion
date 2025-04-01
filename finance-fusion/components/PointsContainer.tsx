import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface PointsContainerProps {
  userId: string;
}

interface UserData {
  points: number;
}

const PointsContainer = ({ userId }: PointsContainerProps) => {
  const [points, setPoints] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: UserData = await response.json();
        setPoints(data.points || 0);
      } catch (err) {
        setError("Failed to load points");
        console.error("Error fetching user points:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPoints();
  }, [userId]);

  const getBadgeVariant = () => {
    if (points >= 100) return "titanium";
    if (points >= 50) return "platinum";
    if (points >= 20) return "gold";
    return "silver";
  };

  const badgeConfig = {
    silver: {
      text: "Silver",
      className: "bg-gray-300 text-gray-800",
      gradient: "from-gray-300 to-gray-400",
    },
    gold: {
      text: "Gold",
      className: "bg-yellow-400 text-yellow-900",
      gradient: "from-yellow-400 to-yellow-600",
    },
    platinum: {
      text: "Platinum",
      className: "bg-blue-200 text-blue-900",
      gradient: "from-blue-200 to-blue-400",
    },
    titanium: {
      text: "Titanium",
      className: "bg-gradient-to-r from-gray-500 to-gray-800 text-white",
      gradient: "from-gray-500 to-gray-800",
    },
  };

  const currentBadge = badgeConfig[getBadgeVariant()];

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading points...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="flex items-center gap-2">
      <Badge className={currentBadge.className}>{currentBadge.text} Tier</Badge>
      <div className="flex items-center">
        <span className="font-medium mr-1 text-white">{points}</span>
        <span className="text-sm text-gray-400 ">points</span>
      </div>
    </div>
  );
};

export default PointsContainer;
