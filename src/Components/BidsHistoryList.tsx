import type { BidModel } from "./LotCard";
import { useAuth } from "../Hooks/UseAuth.tsx";

interface Props {
  bids: BidModel[];
}

function BidsHistoryList({ bids }: Props) {
  const { user } = useAuth();

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);

    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
    });
  };

  if (bids.length === 0) {
    return (
      <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-sm text-center">
        <h3 className="noto text-xl text-gray-500 italic">
          No bids yet. Be the first to place a bid!
        </h3>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h3 className="yeseva text-2xl mb-4">Bidding History ({bids.length})</h3>
      <div className="flex flex-col border border-gray-200 rounded-sm overflow-hidden shadow-sm">
        <div className="bg-gray-100 p-3 flex justify-between font-bold text-gray-700 noto text-sm">
          <span className="w-1/3">Bidder</span>
          <span className="w-1/3 text-center">Amount</span>
          <span className="w-1/3 text-right">Time</span>
        </div>
        {bids.map((bid, index) => {
          const isMe = user && bid.bidderId === Number(user.id);
          const isLeader = index === 0;

          return (
            <div
              key={bid.id}
              className={`flex justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition ${isLeader ? "bg-green-50" : "bg-white"}`}
            >
              <div className="w-1/3 noto text-gray-800 flex items-center gap-2">
                {isMe ? (
                  <span className="font-bold text-blue-600">You</span>
                ) : (
                  bid.bidderName
                )}
                {isLeader && (
                  <span className="text-[10px] uppercase font-bold bg-green-200 text-green-800 px-2 py-0.5 rounded-full">
                    Leader
                  </span>
                )}
              </div>

              <div className="w-1/3 text-center font-bold text-gray-900">
                $ {bid.amount}
              </div>

              <div className="w-1/3 text-right noto text-gray-500 text-sm">
                {formatDate(bid.createdAt)}, {formatTime(bid.createdAt)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BidsHistoryList;
