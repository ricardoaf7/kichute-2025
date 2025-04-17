
import { formatDate } from "@/utils/dateFormatter";

interface MatchHeaderProps {
  round: number;
  date: string;
}

export const MatchHeader = ({ round, date }: MatchHeaderProps) => {
  const formattedDate = formatDate(date);

  return (
    <div className="flex justify-between text-sm text-muted-foreground">
      <span>Rodada {round}</span>
      <span>{formattedDate}</span>
    </div>
  );
};
