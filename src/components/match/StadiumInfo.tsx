import { MapPin } from "lucide-react";
import { Match } from "@/types";

interface StadiumInfoProps {
  match: Match;
}

export const StadiumInfo = ({ match }: StadiumInfoProps) => {
  // Function to get the stadium and city of the match
  // If the stadium and city are specified in the match, use them
  // Otherwise, use the home team's stadium and city
  const getStadiumInfo = () => {
    if (match.stadium) {
      return {
        stadium: match.stadium,
        city: match.city
      };
    } else if (match.homeTeam.homeStadium) {
      return {
        stadium: match.homeTeam.homeStadium,
        city: match.homeTeam.city
      };
    }
    return null;
  };

  const stadiumInfo = getStadiumInfo();

  if (!stadiumInfo) {
    return null;
  }

  return (
    <div className="flex items-center text-xs text-muted-foreground mb-1">
      <MapPin className="h-3 w-3 mr-1" />
      <span>
        {stadiumInfo.stadium}
        {stadiumInfo.city ? `, ${stadiumInfo.city}` : ""}
      </span>
    </div>
  );
};
