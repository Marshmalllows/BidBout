import Header from "../Components/Header.tsx";
import LotCard from "../Components/LotCard.tsx";
import Collage from "../Components/Collage.tsx";
import { useParams } from "react-router-dom";
import { useAxios } from "../API/AxiosInstance.ts";
import { useEffect, useState } from "react";
import { Loader } from "../Components/Loader.tsx";

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
      <div className="pt-12 relative flex-1 justify-center items-start">
        <div className="absolute inset-x-0 top-32 h-[60vh] bg-gray-200 z-0" />
        {lot ? (
          <div className="flex max-w-[1100px] mx-auto items-stretch gap-24">
            <div className="z-1 flex-auto">
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
        ) : (
          <div className="w-screen h-[60vh] flex items-center justify-center">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
}

export default LotDetailsPage;
