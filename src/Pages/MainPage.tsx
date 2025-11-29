import Header from "../Components/Header.tsx";
import SideBar from "../Components/SideBar.tsx";
import LotMainMiniature from "../Components/LotMainMiniature.tsx";
import { useAxios } from "../API/AxiosInstance.ts";
import { useEffect, useState, useMemo } from "react";
import { useLotStore } from "../stores/lotsStore.ts";
import { useSearchParams } from "react-router-dom";
import SortingSelect from "../Components/SortingSelect.tsx";

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

const sortOptions = [
  { id: 0, name: "Newest" },
  { id: 1, name: "Price: Low to High" },
  { id: 2, name: "Price: High to Low" },
  { id: 3, name: "Ending Soon" },
];

function MainPage() {
  const axiosGuest = useAxios(false);
  const [lots, setLots] = useState<LotResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const { setFilters } = useLotStore();

  const searchQuery = searchParams.get("searchQuery") || "";
  const categoryId = Number(searchParams.get("categoryId")) || null;
  const rawStatus = Number(searchParams.get("status"));
  const status = rawStatus > 0 ? rawStatus : 0;

  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";

  const rawSort = Number(searchParams.get("sortBy"));
  const sortBy = !isNaN(rawSort) ? rawSort : 0;

  useEffect(() => {
    setFilters({
      searchQuery,
      categoryId,
      status,
      minPrice,
      maxPrice,
      startDate,
      endDate,
      sortBy,
    });
  }, [
    setFilters,
    searchQuery,
    categoryId,
    status,
    minPrice,
    maxPrice,
    startDate,
    endDate,
    sortBy,
  ]);

  useEffect(() => {
    const fetchLots = async () => {
      try {
        const res = await axiosGuest.get("/lots");
        setLots(res.data);
      } catch (err) {
        console.error("Failed to fetch lots:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLots();
  }, [axiosGuest]);

  const handleSortChange = (
    option: { id: number; name: string } | undefined,
  ) => {
    const newParams = new URLSearchParams(searchParams);
    if (option && option.id !== 0) {
      newParams.set("sortBy", option.id.toString());
    } else {
      newParams.delete("sortBy");
    }
    setSearchParams(newParams);
  };

  const currentSortOption =
    sortOptions.find((o) => o.id === sortBy) || sortOptions[0];

  const filteredAndSortedLots = useMemo(() => {
    const filtered = lots.filter((lot) => {
      const now = new Date().getTime();
      const lotStart = new Date(lot.startDate).getTime();
      const lotEnd = new Date(lot.endDate).getTime();

      const matchesSearch = lot.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryId && categoryId !== 0 ? lot.category.id === categoryId : true;

      const currentPrice =
        lot.currentBid > 0 ? lot.currentBid : lot.reservePrice || 0;
      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : Infinity;
      const matchesPrice = currentPrice >= min && currentPrice <= max;

      const filterStart = startDate ? new Date(startDate).getTime() : 0;
      const matchesStart = lotStart >= filterStart;
      const filterEnd = endDate
        ? new Date(endDate).setHours(23, 59, 59, 999)
        : Infinity;
      const matchesEnd = lotEnd <= filterEnd;

      let matchesStatus = true;
      if (status === 1) matchesStatus = now >= lotStart && now < lotEnd;
      else if (status === 2) matchesStatus = now < lotStart;
      else if (status === 3) matchesStatus = now >= lotEnd;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesStart &&
        matchesEnd &&
        matchesStatus
      );
    });

    return filtered.sort((a, b) => {
      const priceA = a.currentBid > 0 ? a.currentBid : a.reservePrice || 0;
      const priceB = b.currentBid > 0 ? b.currentBid : b.reservePrice || 0;
      const endA = new Date(a.endDate).getTime();
      const endB = new Date(b.endDate).getTime();

      switch (sortBy) {
        case 1:
          return priceA - priceB;
        case 2:
          return priceB - priceA;
        case 3:
          return endA - endB;
        case 0:
        default:
          return b.id - a.id;
      }
    });
  }, [
    lots,
    searchQuery,
    categoryId,
    minPrice,
    maxPrice,
    startDate,
    endDate,
    status,
    sortBy,
  ]);

  const animationKey = JSON.stringify({
    searchQuery,
    categoryId,
    status,
    minPrice,
    maxPrice,
    startDate,
    endDate,
    sortBy,
  });

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      <Header />

      <div className="flex flex-col md:flex-row flex-1 w-full relative">
        <div className="w-full md:w-auto">
          <SideBar />
        </div>

        <div className="p-4 w-full">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-gray-200 pb-2 gap-2 sm:gap-0">
              <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
                <h3 className="yeseva text-xl sm:text-2xl">
                  {searchQuery
                    ? `Search results for "${searchQuery}"`
                    : "Popular Lots"}
                </h3>
                <div className="ml-auto sm:ml-0">
                  <SortingSelect
                    items={sortOptions}
                    value={currentSortOption}
                    onChange={handleSortChange}
                  />
                </div>
              </div>
              <span className="noto text-gray-500 text-sm mb-1 self-end">
                {filteredAndSortedLots.length} items found
              </span>
            </div>
          </div>

          {filteredAndSortedLots.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 animate-pulse">
              <p className="noto text-xl text-center">
                No lots found matching your criteria.
              </p>
              <p className="noto text-sm mt-2 text-center">
                Try adjusting your filters or search query.
              </p>
            </div>
          )}
          <div
            key={animationKey}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {loading
              ? Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex flex-col bg-white border border-gray-200 rounded-sm overflow-hidden animate-pulse"
                  >
                    <div className="aspect-square w-full bg-gray-200" />
                    <div className="p-3 flex flex-row items-center justify-between gap-3">
                      <div className="flex flex-col w-full gap-2 overflow-hidden">
                        <div className="h-5 bg-gray-200 w-3/4 rounded-sm" />
                        <div className="h-3 bg-gray-200 w-1/2 rounded-sm" />
                      </div>
                      <div className="flex flex-col items-end pl-3 border-l border-gray-100 min-w-max gap-1">
                        <div className="h-3 bg-gray-200 w-10 rounded-sm" />
                        <div className="h-6 bg-gray-200 w-14 rounded-sm" />
                      </div>
                    </div>
                  </div>
                ))
              : filteredAndSortedLots.map((lot) => (
                  <div
                    key={lot.id}
                    className="animate-[fadeIn_0.5s_ease-in-out_both]"
                  >
                    <LotMainMiniature lot={lot} />
                  </div>
                ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default MainPage;
