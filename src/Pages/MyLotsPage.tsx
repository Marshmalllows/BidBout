import Header from "../Components/Header.tsx";
import { useAxios } from "../API/AxiosInstance.ts";
import { useCallback, useEffect, useState } from "react";
import type { LotResponse } from "./MainPage.tsx";
import LotMainMiniature from "../Components/LotMainMiniature.tsx";
import { useNavigate } from "react-router-dom";

function MyLotsPage() {
  const axiosAuth = useAxios(true);
  const navigate = useNavigate();
  const [lots, setLots] = useState<LotResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyLots = useCallback(async () => {
    try {
      const res = await axiosAuth.get("/lots/my");
      setLots(res.data);
    } catch (err) {
      console.error("Failed to fetch my lots:", err);
    } finally {
      setLoading(false);
    }
  }, [axiosAuth]);

  useEffect(() => {
    void fetchMyLots();
  }, [fetchMyLots]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this lot?")) return;
    try {
      await axiosAuth.delete(`/lots/${id}`);
      setLots((prev) => prev.filter((lot) => lot.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete lot. It might be already closed.");
    }
  };

  const handleEdit = (lot: LotResponse) => {
    const now = new Date();
    const start = new Date(lot.startDate);

    if (now >= start) {
      alert("You cannot edit a lot that has already started!");
      return;
    }
    navigate(`/lot-settings/${lot.id}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      <Header />

      <div className="max-w-[1100px] w-full mx-auto my-6 px-4 md:px-24">
        <div className="flex justify-between items-center">
          <h1 className="yeseva text-3xl">My Lots</h1>
        </div>
      </div>

      <div className="bg-gray-200 w-full flex-1 pb-10">
        <div className="max-w-[1100px] w-full mx-auto py-6 px-4 md:px-24">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
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

                  <div className="p-2 border-t border-gray-100 flex justify-end gap-2">
                    <div className="h-8 w-8 bg-gray-200 rounded-sm" />
                    <div className="h-8 w-8 bg-gray-200 rounded-sm" />
                  </div>
                </div>
              ))}
            </div>
          ) : lots.length === 0 ? (
            <div className="text-center py-10 text-gray-500 noto">
              You haven't created any lots yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {lots.map((lot) => (
                <div
                  key={lot.id}
                  className="flex flex-col gap-2 group animate-[fadeIn_0.5s_ease-in-out_both]"
                >
                  <LotMainMiniature lot={lot} />

                  <div className="flex items-center justify-between bg-white p-2 border border-gray-200 rounded-sm shadow-sm">
                    <span className="noto text-sm text-gray-500 ml-1">
                      Actions:
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(lot)}
                        className="p-2 hover:bg-gray-100 rounded-xs transition-colors group/btn"
                        title="Edit"
                      >
                        <img
                          src="/Icons/pencil.svg"
                          alt="Edit"
                          className="w-5 h-5 opacity-70 group-hover/btn:opacity-100"
                        />
                      </button>
                      <button
                        onClick={() => handleDelete(lot.id)}
                        className="p-2 hover:bg-red-100 rounded-xs transition-colors group/btn"
                        title="Delete"
                      >
                        <img
                          src="/Icons/trash.svg"
                          alt="Delete"
                          className="w-5 h-5 opacity-70 group-hover/btn:opacity-100"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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

export default MyLotsPage;
