import Header from "../Components/Header.tsx";
import SideBar from "../Components/SideBar.tsx";
import LotMainMiniature from "../Components/LotMainMiniature.tsx";
import { useAxios } from "../API/AxiosInstance.ts";
import { useEffect, useState } from "react";

type LotResponse = {
  id: number;
  title: string;
  reservePrice: number;
  category: {
    id: number;
    name: string;
  };
  images: {
    id: number;
    imageData: string;
  }[];
};

function MainPage() {
  const axiosGuest = useAxios(false);
  const [lots, setLots] = useState<LotResponse[]>([]);

  useEffect(() => {
    const fetchLots = async () => {
      try {
        const res = await axiosGuest.get("/lots");
        setLots(res.data);
      } catch (err) {
        console.error("Failed to fetch lots:", err);
      }
    };

    fetchLots();
  }, [axiosGuest]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <div className="flex flex-1 flex-row">
        <SideBar />
        <div>
          <h3 className="yeseva text-2xl m-4">Popular</h3>
          <div className="mx-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {lots.map((lot) => (
              <LotMainMiniature key={lot.id} lot={lot} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
