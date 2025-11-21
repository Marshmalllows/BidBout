import Header from "../Components/Header.tsx";
import LotCard from "../Components/LotCard.tsx";
import Collage from "../Components/Collage.tsx";
import { useParams } from "react-router-dom";
import { useAxios } from "../API/AxiosInstance.ts";
import { useEffect, useState } from "react";

type LotResponse = {
  id: number;
  title: string;
  category: { name: string };
  reservePrice: number;
  endDate: Date;
  images: { imageData: string }[];
  pickupPlace: string;
  description: string;
};

function LotDetailsPage() {
  const { id } = useParams();
  const axiosGuest = useAxios(false);

  const [lot, setLot] = useState<LotResponse | null>(null);

  useEffect(() => {
    const fetchLot = async () => {
      try {
        const res = await axiosGuest.get(`/lots/${id}`);
        setLot(res.data);
      } catch (err) {
        console.error("Failed to load lot:", err);
      }
    };

    fetchLot();
  }, [id, axiosGuest]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <div className="my-20 relative flex-1 flex justify-center items-start">
        <div className="absolute inset-x-0 top-12 h-110 bg-gray-200" />
        {lot && (
          <div className="relative flex  max-w-[1100px] justify-center items-stretch z-1 -mt-12 -mb-12 gap-24">
            <div className="flex flex-col">
              <h1 className="yeseva text-3xl">{lot.title}</h1>
              <h3 className="noto italic text-xl mb-2">{lot.category.name}</h3>
              <Collage images={lot.images} />
              <h2 className="yeseva text-xl mt-12">
                Description from the seller
              </h2>
              <p className="noto text-lg text-justify my-4">
                {lot.description}
              </p>
            </div>
            <div className="sticky top-0 self-start">
              <LotCard
                endDate={lot.endDate}
                reservePrice={lot.reservePrice}
                pickupPlace={lot.pickupPlace}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LotDetailsPage;
