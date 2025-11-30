import { useState, useEffect } from "react";
import Input from "./Input.tsx";
import Button from "./Button.tsx";
import { useAxios } from "../API/AxiosInstance.ts";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth.tsx";

export interface BidModel {
  id: number;
  amount: number;
  createdAt: string;
  bidderId: number;
  bidderName: string;
}

interface LotCardProps {
  lotId: number;
  reservePrice: number;
  pickupPlace: string;
  startDate: Date;
  endDate: Date;
  initialPrice: number;
  bidsHistory: BidModel[];
  onBidSuccess: () => void;
  sellerEmail?: string;
  sellerPhone?: string;
}

type AuctionStatus = "upcoming" | "active" | "closed";

function LotCard({
  lotId,
  reservePrice,
  pickupPlace,
  startDate,
  endDate,
  initialPrice,
  bidsHistory,
  onBidSuccess,
  sellerEmail,
  sellerPhone,
}: LotCardProps) {
  const [timerLabel, setTimerLabel] = useState("Status:");
  const [timerText, setTimerText] = useState("");
  const [status, setStatus] = useState<AuctionStatus>("active");

  const [currentPrice, setCurrentPrice] = useState(initialPrice || 0);
  const [bidAmount, setBidAmount] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [bids, setBids] = useState<BidModel[]>(bidsHistory || []);

  const axiosAuth = useAxios(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    setCurrentPrice(initialPrice || 0);
    setBids(bidsHistory || []);
  }, [initialPrice, bidsHistory]);

  useEffect(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const updateTime = () => {
      const now = new Date();
      let targetDate = end;
      let newStatus: AuctionStatus;
      let label: string;

      if (now < start) {
        newStatus = "upcoming";
        targetDate = start;
        label = "Starts in:";
      } else if (now >= end) {
        newStatus = "closed";
        label = "Status:";
        setTimerLabel(label);
        setTimerText("Closed");
        setStatus(newStatus);
        return;
      } else {
        newStatus = "active";
        targetDate = end;
        label = "Closes in:";
      }

      setStatus(newStatus);
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

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [startDate, endDate]);

  const handleQuickBidClick = (amount: number) => {
    setBidAmount(amount.toString());
    setError(null);
  };

  const handlePlaceBid = async () => {
    const amount = Number(bidAmount);
    setError(null);
    if (!amount || amount <= currentPrice) {
      setError(`Bid must be higher than $${currentPrice}`);
      return;
    }
    setLoading(true);
    try {
      await axiosAuth.post("/bids", { lotId, amount });
      onBidSuccess();
      setBidAmount("");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSetMaxBid = async () => {
    const amount = Number(bidAmount);
    setError(null);
    if (!amount || amount <= currentPrice) {
      setError(`Max bid must be higher than $${currentPrice}`);
      return;
    }
    setLoading(true);
    try {
      await axiosAuth.post("/bids/auto", { lotId, amount });
      alert("Max bid set");
      onBidSuccess();
      setBidAmount("");
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (err: unknown) => {
    if (err instanceof AxiosError && err.response?.status === 401) {
      navigate("/login");
      return;
    }
    const msg =
      err instanceof AxiosError
        ? err.response?.data || "Failed to place bid"
        : "Unknown error";
    setError(typeof msg === "string" ? msg : JSON.stringify(msg));
  };

  const topBid = bids.length > 0 ? bids[0] : null;
  const isMeLeader = topBid && user && topBid.bidderId === Number(user.id);
  const basePrice = currentPrice > 0 ? currentPrice : reservePrice || 0;
  const quickBid1 = basePrice + 10;
  const quickBid2 = basePrice + 25;
  const quickBid3 = basePrice + 50;

  const isInteractable = status === "active";

  return (
    <div className="flex flex-col justify-start h-full">
      <h2 className="noto ml-2 mb-2 text-xl">
        {timerLabel}{" "}
        <span
          className={`font-bold ${status === "closed" ? "text-red-700" : "text-black"}`}
        >
          {timerText}
        </span>
      </h2>
      <div
        className={`flex flex-col p-4 md:p-6 shadow-md border-1 border-gray-300 rounded-xs w-full min-h-full gap-2 transition-colors ${status === "closed" ? "bg-gray-50" : "bg-white"}`}
      >
        <h3 className="noto italic text-lg text-gray-500">
          {status === "closed" ? "Winning bid" : "Current bid"}
        </h3>
        <h2 className="lora text-4xl md:text-5xl mb-2 text-gray-900 break-words">
          {currentPrice > 0 ? `$ ${currentPrice}` : "No bids"}
        </h2>

        <h3 className="noto italic text-lg mb-4 text-gray-500">
          {reservePrice > 0
            ? `Reserve price $${reservePrice}`
            : "No reserve price"}
        </h3>

        {status !== "closed" ? (
          <>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <Button
                variant="rounded"
                onClick={() => handleQuickBidClick(quickBid1)}
                disabled={!isInteractable}
                customClasses="px-1 text-sm md:text-base"
              >
                $ {quickBid1}
              </Button>
              <Button
                variant="rounded"
                onClick={() => handleQuickBidClick(quickBid2)}
                disabled={!isInteractable}
                customClasses="px-1 text-sm md:text-base"
              >
                $ {quickBid2}
              </Button>
              <Button
                variant="rounded"
                onClick={() => handleQuickBidClick(quickBid3)}
                disabled={!isInteractable}
                customClasses="px-1 text-sm md:text-base"
              >
                $ {quickBid3}
              </Button>
            </div>
            <div className="flex flex-col gap-1">
              <Input
                type="number"
                placeholder={
                  status === "upcoming"
                    ? "Wait for start..."
                    : `$ ${basePrice + 1} or up`
                }
                font="arimo"
                customClasses={`bg-gray-200 ${error ? "border-red-500 border" : ""}`}
                value={bidAmount}
                onChange={(e) => {
                  setBidAmount(e.target.value);
                  setError(null);
                }}
                disabled={!isInteractable}
              />
              {error && (
                <span className="text-red-500 text-sm ml-1">{error}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-2 mb-4">
              <div className="flex-1 min-w-[120px]">
                <Button
                  variant="secondary"
                  onClick={handlePlaceBid}
                  disabled={!bidAmount || loading || !isInteractable}
                  customClasses="w-full"
                >
                  {loading ? "Placing..." : "Place bid"}
                </Button>
              </div>
              <div className="flex-1 min-w-[120px]">
                <Button
                  onClick={handleSetMaxBid}
                  disabled={!bidAmount || loading || !isInteractable}
                  customClasses="w-full"
                >
                  Set max bid
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 border-t border-b border-gray-200 my-4 bg-gray-100 rounded-sm">
            <h3 className="yeseva text-xl text-gray-600">Sold</h3>
            <p className="noto text-sm text-gray-500 italic">
              Bidding is closed.
            </p>
          </div>
        )}
        <h3 className="noto italic text-lg mt-2 mb-2 break-words">
          Pickup in {pickupPlace}
        </h3>
        {topBid && (
          <div
            className={`border flex flex-col p-4 mb-2 rounded-sm ${isMeLeader ? "bg-green-50 border-green-400" : "bg-gray-100 border-gray-300"}`}
          >
            <h3
              className={`yeseva text-lg mb-1 ${isMeLeader ? "text-green-900" : "text-gray-900"}`}
            >
              {status === "closed"
                ? isMeLeader
                  ? "You won this lot!"
                  : "Winner"
                : isMeLeader
                  ? "You are the leader"
                  : "Current Leader"}
            </h3>

            <p className="noto text-md text-gray-800 break-all">
              <span className="font-bold">{topBid.bidderName}</span>: ${" "}
              {topBid.amount}
            </p>
            {status === "closed" && isMeLeader && sellerEmail && (
              <div className="mt-4 pt-3 border-t border-green-300">
                <p className="noto text-sm text-gray-600 mb-2 italic">
                  Seller contact info:
                </p>
                <div className="noto text-sm font-bold text-gray-800 flex flex-col gap-1">
                  <div className="break-all">
                    Email: <span className="text-blue-800">{sellerEmail}</span>
                  </div>
                  {sellerPhone && <div>Phone: {sellerPhone}</div>}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default LotCard;
