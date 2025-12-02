import Header from "../Components/Header.tsx";
import LotCard, { type BidModel } from "../Components/LotCard.tsx";
import BidsHistoryList from "../Components/BidsHistoryList.tsx";
import Collage from "../Components/Collage.tsx";
import { useParams, Link } from "react-router-dom";
import { useAxios } from "../API/AxiosInstance.ts";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../Hooks/useAuth.tsx";

type LotResponse = {
  id: number;
  title: string;
  category: { name: string };
  reservePrice: number;
  startDate: Date;
  endDate: Date;
  images: { imageData: string }[];
  pickupPlace: string;
  description: string | null;
  currentBid: number;
  sellerName: string;
  creatorId: number;
  sellerRating: number;
  sellerReviewCount: number;
  bids: BidModel[];
  sellerEmail?: string;
  sellerPhone?: string;
};

function LotDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const axiosClient = useAxios(!!user);
  const [lot, setLot] = useState<LotResponse | null>(null);

  const fetchLot = useCallback(async () => {
    if (!id) return;
    try {
      const res = await axiosClient.get(`/lots/${id}`);
      setLot(res.data);
    } catch (err) {
      console.error("Failed to load lot details:", err);
    }
  }, [id, axiosClient]);

  useEffect(() => {
    fetchLot();
    const interval = setInterval(fetchLot, 5000);
    return () => clearInterval(interval);
  }, [fetchLot]);

  return (
    <>
      <style>{`
        html, body { 
          overflow-x: hidden; 
          max-width: 100%;
        }
      `}</style>

      <div className="flex flex-col min-h-screen bg-white overflow-x-hidden md:overflow-x-visible">
        <Header />
        <div className="pt-6 md:pt-12 relative flex-1 justify-center items-start">
          {lot ? (
            <div className="flex flex-col md:flex-row max-w-[1100px] w-full mx-auto items-start gap-8 px-4 md:px-0 relative z-10 pb-10">
              <div className="flex-auto w-full md:w-2/3">
                <h1 className="yeseva text-3xl md:text-4xl mb-1 break-words">
                  {lot.title}
                </h1>

                <div className="flex items-center gap-4 mb-6 flex-wrap">
                  <h3 className="noto italic text-xl text-gray-600">
                    {lot.category.name}
                  </h3>
                  <span className="text-gray-400">•</span>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="noto text-lg text-gray-800">Sold by:</span>
                    <Link
                      to={`/seller/${lot.creatorId}`}
                      className="font-bold underline hover:text-blue-700 transition noto text-lg"
                    >
                      {lot.sellerName}
                    </Link>
                    <div
                      className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-gray-300 shadow-sm ml-1"
                      title={`${lot.sellerReviewCount} reviews`}
                    >
                      <span className="text-yellow-500 text-sm">★</span>
                      <span className="text-sm font-bold text-gray-700">
                        {lot.sellerRating}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({lot.sellerReviewCount})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative my-8 isolate">
                  <div className="absolute top-6 bottom-6 w-screen md:w-[200vw] left-1/2 -translate-x-1/2 bg-gray-200 -z-10 pointer-events-none" />
                  <Collage images={lot.images} />
                </div>

                <div className="mb-8 md:hidden">
                  <LotCard
                    lotId={lot.id}
                    reservePrice={lot.reservePrice}
                    pickupPlace={lot.pickupPlace}
                    startDate={lot.startDate}
                    endDate={lot.endDate}
                    initialPrice={lot.currentBid}
                    bidsHistory={lot.bids}
                    onBidSuccess={fetchLot}
                    sellerEmail={lot.sellerEmail}
                    sellerPhone={lot.sellerPhone}
                  />
                </div>

                <h2 className="yeseva text-2xl mt-8 mb-4">
                  Description from the seller
                </h2>
                <p
                  className={`noto text-lg text-justify leading-relaxed break-words ${lot.description ? "text-gray-800" : "text-gray-400 italic"}`}
                >
                  {lot.description || "No description provided by the seller."}
                </p>

                <div className="mb-10 md:mb-20">
                  <BidsHistoryList bids={lot.bids} />
                </div>
              </div>

              <div className="hidden md:block w-full md:w-1/3 md:min-w-[350px] mb-6 md:mb-0 md:sticky md:top-24 h-fit">
                <LotCard
                  lotId={lot.id}
                  reservePrice={lot.reservePrice}
                  pickupPlace={lot.pickupPlace}
                  startDate={lot.startDate}
                  endDate={lot.endDate}
                  initialPrice={lot.currentBid}
                  bidsHistory={lot.bids}
                  onBidSuccess={fetchLot}
                  sellerEmail={lot.sellerEmail}
                  sellerPhone={lot.sellerPhone}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row max-w-[1100px] w-full mx-auto items-start gap-8 px-4 md:px-0 relative z-10 pb-10 animate-pulse">
              <div className="flex-auto w-full md:w-2/3">
                <div className="h-10 bg-gray-200 rounded w-3/4 mb-4" />
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-6 bg-gray-200 rounded w-1/3" />
                  <div className="h-6 bg-gray-200 rounded w-1/4" />
                </div>

                <div className="h-96 bg-gray-200 w-full mb-8 rounded-sm" />

                <div className="h-64 bg-gray-200 w-full mb-8 md:hidden rounded-sm" />

                <div className="h-8 bg-gray-200 w-1/2 mb-4 rounded" />
                <div className="space-y-2 mb-10">
                  <div className="h-4 bg-gray-200 w-full rounded" />
                  <div className="h-4 bg-gray-200 w-full rounded" />
                  <div className="h-4 bg-gray-200 w-5/6 rounded" />
                </div>

                <div className="h-40 bg-gray-200 w-full rounded-sm" />
              </div>

              <div className="hidden md:block w-full md:w-1/3 md:min-w-[350px] h-[500px] bg-gray-200 rounded-sm" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default LotDetailsPage;
