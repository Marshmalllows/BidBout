import { useEffect, useState } from "react";
import Select from "./Select.tsx";
import Input from "./Input.tsx";
import Button from "./Button.tsx";
import { useAxios } from "../API/AxiosInstance.ts";
import { useSearchParams } from "react-router-dom";

type CategoryResponse = {
  id: number;
  name: string;
};

interface ApiCategory {
  id: number;
  name: string;
}

const STATUS_OPTIONS = [
  { id: 0, name: "All Statuses" },
  { id: 1, name: "Active" },
  { id: 2, name: "Upcoming" },
  { id: 3, name: "Closed" },
];

function SideBar() {
  const axiosGuest = useAxios(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [localCategory, setLocalCategory] = useState<
    CategoryResponse | undefined
  >();
  const [localStatus, setLocalStatus] = useState<CategoryResponse | undefined>(
    STATUS_OPTIONS[0],
  );
  const [localMinPrice, setLocalMinPrice] = useState(
    searchParams.get("minPrice") || "",
  );
  const [localMaxPrice, setLocalMaxPrice] = useState(
    searchParams.get("maxPrice") || "",
  );
  const [localStart, setLocalStart] = useState(
    searchParams.get("startDate") || "",
  );
  const [localEnd, setLocalEnd] = useState(searchParams.get("endDate") || "");

  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosGuest.get("/categories");
        const formatted: CategoryResponse[] = res.data.map(
          (c: ApiCategory) => ({ id: c.id, name: c.name }),
        );
        const allCategories = [{ id: 0, name: "All Categories" }, ...formatted];
        setCategories(allCategories);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, [axiosGuest]);

  useEffect(() => {
    setLocalMinPrice(searchParams.get("minPrice") || "");
    setLocalMaxPrice(searchParams.get("maxPrice") || "");
    setLocalStart(searchParams.get("startDate") || "");
    setLocalEnd(searchParams.get("endDate") || "");

    const urlStatus = searchParams.get("status");
    if (urlStatus) {
      const found = STATUS_OPTIONS.find((s) => s.id === Number(urlStatus));
      setLocalStatus(found);
    } else {
      setLocalStatus(undefined);
    }

    const urlCatId = searchParams.get("categoryId");
    if (categories.length > 0) {
      if (urlCatId) {
        const found = categories.find((c) => c.id === Number(urlCatId));
        setLocalCategory(found);
      } else {
        setLocalCategory(undefined);
      }
    }
  }, [searchParams, categories]);

  const handleApplyFilters = () => {
    const newParams = new URLSearchParams(searchParams);

    if (localCategory && localCategory.id !== 0) {
      newParams.set("categoryId", localCategory.id.toString());
    } else {
      newParams.delete("categoryId");
    }

    if (localStatus && localStatus.id !== 0) {
      newParams.set("status", localStatus.id.toString());
    } else {
      newParams.delete("status");
    }

    if (localMinPrice) newParams.set("minPrice", localMinPrice);
    else newParams.delete("minPrice");

    if (localMaxPrice) newParams.set("maxPrice", localMaxPrice);
    else newParams.delete("maxPrice");

    if (localStart) newParams.set("startDate", localStart);
    else newParams.delete("startDate");

    if (localEnd) newParams.set("endDate", localEnd);
    else newParams.delete("endDate");

    setSearchParams(newParams);
    setIsMobileExpanded(false);
  };

  return (
    <div className="flex flex-col bg-gray-200 w-full md:w-[300px] md:min-h-full">
      <div
        className="p-4 flex justify-between items-center md:hidden cursor-pointer bg-gray-300"
        onClick={() => setIsMobileExpanded(!isMobileExpanded)}
      >
        <h2 className="text-xl yeseva">Filters</h2>
        <span className="noto font-bold text-2xl">
          {isMobileExpanded ? "−" : "+"}
        </span>
      </div>

      <div
        className={`p-8 gap-4 flex-col ${
          isMobileExpanded ? "flex" : "hidden"
        } md:flex`}
      >
        <h2 className="text-2xl yeseva mb-2 hidden md:block">Filters</h2>

        <div>
          <h3 className="text-xl noto mb-1">Status</h3>
          <Select
            placeholder="Select status..."
            items={STATUS_OPTIONS}
            value={localStatus}
            onChange={(val) => setLocalStatus(val)}
            customClasses="bg-white"
          />
        </div>

        <div>
          <h3 className="text-xl noto mb-1">Category</h3>
          <Select
            placeholder="Select category..."
            items={categories}
            value={localCategory}
            onChange={(val) => setLocalCategory(val)}
            customClasses="bg-white"
          />
        </div>

        <div>
          <h3 className="text-xl noto mb-6">Price</h3>
          <div className="flex gap-2">
            <Input
              placeholder="From"
              customClasses="bg-white"
              type="number"
              value={localMinPrice}
              onChange={(e) => setLocalMinPrice(e.target.value)}
            />
            <Input
              placeholder="To"
              customClasses="bg-white"
              type="number"
              value={localMaxPrice}
              onChange={(e) => setLocalMaxPrice(e.target.value)}
            />
          </div>
        </div>

        <div>
          <h3 className="text-xl noto mb-1">Starts after</h3>
          <Input
            type="date"
            customClasses="bg-white"
            value={localStart}
            onChange={(e) => setLocalStart(e.target.value)}
          />
        </div>

        <div>
          <h3 className="text-xl noto mb-1">Ends before</h3>
          <Input
            type="date"
            customClasses="bg-white"
            value={localEnd}
            onChange={(e) => setLocalEnd(e.target.value)}
          />
        </div>

        <Button
          customClasses="mt-4"
          variant="secondary"
          onClick={handleApplyFilters}
        >
          Apply filters
        </Button>
      </div>
    </div>
  );
}

export default SideBar;
