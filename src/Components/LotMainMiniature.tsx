import type { LotResponse } from "../Pages/MainPage.tsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface Props {
  lot: LotResponse;
}

function LotMainMiniature({ lot }: Props) {
  const navigate = useNavigate();
  const [timerText, setTimerText] = useState("");
  const [timerLabel, setTimerLabel] = useState("");
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const start = new Date(lot.startDate);
      const end = new Date(lot.endDate);

      let targetDate = end;
      let label = "Ends in";

      if (now < start) {
        targetDate = start;
        label = "Starts in";
      } else if (now >= end) {
        setIsClosed(true);
        setTimerLabel("Status");
        setTimerText("Closed");
        return;
      } else {
        targetDate = end;
        label = "Ends in";
      }

      setTimerLabel(label);

      const diff = targetDate.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      let formatted: string;
      if (days > 0) {
        formatted = `${days}d ${hours}h`;
      } else if (hours > 0) {
        formatted = `${hours}h ${minutes}m`;
      } else {
        formatted = `${minutes}m ${seconds}s`;
      }

      setTimerText(formatted);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [lot.startDate, lot.endDate]);

  const hasBid = lot.currentBid > 0;
  const priceToDisplay = hasBid ? lot.currentBid : lot.reservePrice;
  const priceLabel = hasBid ? "Current bid" : "Reserve price";

  const imageSrc =
    lot.images.length > 0
      ? `data:image/jpeg;base64,${lot.images[0].imageData}`
      : "/placeholder.png";

  return (
    <div
      onClick={() => navigate(`/lot/${lot.id}`)}
      className="flex flex-col cursor-pointer group bg-gray-100 hover:shadow-xl transition-all duration-300 border border-gray-200 rounded-sm overflow-hidden"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        <img
          src={imageSrc}
          alt={lot.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500 ease-in-out"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black/2 backdrop-blur-xs p-2 flex justify-between items-center px-3">
          <span className="text-gray-200 text-xs uppercase font-medium tracking-wide">
            {timerLabel}
          </span>
          <span
            className={`font-mono font-bold text-sm ${isClosed ? "text-red-400" : "text-white"}`}
          >
            {timerText}
          </span>
        </div>
      </div>

      <div className="p-3 flex flex-row items-center justify-between gap-3">
        <div className="flex flex-col overflow-hidden">
          <h4
            className="noto font-bold text-lg leading-tight truncate text-gray-800"
            title={lot.title}
          >
            {lot.title}
          </h4>
          <p className="noto italic text-sm text-gray-500 truncate">
            {lot.category.name}
          </p>
        </div>
        <div className="flex flex-col min-w-max items-end pl-3 border-l border-gray-300">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
            {priceLabel}
          </span>
          <span
            className={`yeseva text-xl leading-none mt-1 ${
              hasBid ? "text-green-700" : "text-gray-900"
            }`}
          >
            $ {priceToDisplay}
          </span>
        </div>
      </div>
    </div>
  );
}

export default LotMainMiniature;
