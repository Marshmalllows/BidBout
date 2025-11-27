import Header from "../Components/Header.tsx";
import SideBar from "../Components/SideBar.tsx";
import LotMainMiniature from "../Components/LotMainMiniature.tsx";
import { useAxios } from "../API/AxiosInstance.ts";
import { useEffect, useState } from "react";
import { useLotStore } from "../stores/lotsStore.ts";

export type LotResponse = {
  id: number;
  title: string;
  reservePrice: number;
  currentBid: number;
  startDate: string;
  endDate: string;
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
  const { searchQuery } = useLotStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLots = async () => {
      try {
        const res = await axiosGuest
          .get("/lots")
          .finally(() => setLoading(false));
        setLots(res.data);
      } catch (err) {
        console.error("Failed to fetch lots:", err);
      }
    };

    fetchLots();
  }, [axiosGuest]);

  const filteredLots = lots.filter((lot) =>
    lot.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <div className="flex flex-1 flex-row w-full">
        <SideBar />
        <div className="m-4 w-full">
          <h3 className="yeseva text-2xl mb-4">Popular</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex flex-col bg-white border border-gray-200 rounded-sm overflow-hidden animate-pulse"
                  >
                    <div className="aspect-square w-full bg-gray-200" />
                    <div className="p-3 flex flex-row items-center justify-between gap-3">
                      <div className="flex flex-col w-full gap-2 overflow-hidden">
                        <div className="h-5 bg-gray-200 w-3/4 rounded-sm" />{" "}
                        <div className="h-3 bg-gray-200 w-1/2 rounded-sm" />{" "}
                      </div>
                      <div className="flex flex-col items-end pl-3 border-l border-gray-100 min-w-max gap-1">
                        <div className="h-3 bg-gray-200 w-10 rounded-sm" />{" "}
                        <div className="h-6 bg-gray-200 w-14 rounded-sm" />{" "}
                      </div>
                    </div>
                  </div>
                ))
              : filteredLots.map((lot) => (
                  <LotMainMiniature key={lot.id} lot={lot} />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
