import Header from "../Components/Header.tsx";
import LotCard, { type BidModel } from "../Components/LotCard.tsx";
import BidsHistoryList from "../Components/BidsHistoryList.tsx";
import Collage from "../Components/Collage.tsx";
import { useParams } from "react-router-dom";
import { useAxios } from "../API/AxiosInstance.ts";
import { useCallback, useEffect, useState } from "react";
import { Loader } from "../Components/Loader.tsx";
import { useAuth } from "../Hooks/UseAuth.tsx";

type LotResponse = {
  id: number;
  title: string;
  category: { name: string };
  reservePrice: number;
  startDate: Date; // <--- Поле є
  endDate: Date;
  images: { imageData: string }[];
  pickupPlace: string;
  description: string;
  currentBid: number;
  sellerName: string;
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
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <div className="pt-12 relative flex-1 justify-center items-start">
        <div className="absolute inset-x-0 top-32 h-[60vh] bg-gray-200 z-0" />
        {lot ? (
          <div className="flex max-w-[1100px] w-full mx-auto items-stretch gap-8 px-4 md:px-0 relative z-10">
            <div className="flex-auto w-2/3">
              <h1 className="yeseva text-3xl md:text-4xl mb-1">{lot.title}</h1>
              <div className="flex items-center gap-4 mb-6">
                <h3 className="noto italic text-xl text-gray-600">
                  {lot.category.name}
                </h3>
                <span className="text-gray-400">•</span>
                <h3 className="noto text-lg text-gray-800">
                  Sold by: <span className="font-bold">{lot.sellerName}</span>
                </h3>
              </div>
              <Collage images={lot.images} />
              <h2 className="yeseva text-2xl mt-12 mb-4">
                Description from the seller
              </h2>
              <p className="noto text-lg text-justify leading-relaxed text-gray-800">
                {lot.description}
              </p>

              <div className="mb-20">
                <BidsHistoryList bids={lot.bids} />
              </div>
            </div>
            <div className="w-1/3 min-w-[350px]">
              <div className="sticky top-12">
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
          </div>
        ) : (
          <div className="w-full h-[60vh] flex items-center justify-center relative z-10">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
}

export default LotDetailsPage;
