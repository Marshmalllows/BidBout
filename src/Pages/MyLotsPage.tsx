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
      console.error(err); // Логуємо помилку
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
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <div className="max-w-[1100px] w-full mx-auto my-6 px-4 md:px-24">
        <div className="flex justify-between items-center">
          <h1 className="yeseva text-3xl">My Lots</h1>
        </div>
      </div>

      <div className="bg-gray-200 w-full flex-1 pb-10">
        <div className="max-w-[1100px] w-full mx-auto py-6 px-4 md:px-24">
          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : lots.length === 0 ? (
            <div className="text-center py-10 text-gray-500 noto">
              You haven't created any lots yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {lots.map((lot) => (
                <div key={lot.id} className="flex flex-col gap-2 group">
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
    </div>
  );
}

export default MyLotsPage;
