import { useEffect, useState } from "react";
import Select from "./Select.tsx";
import Input from "./Input.tsx";
import Button from "./Button.tsx";
import { useAxios } from "../API/AxiosInstance.ts";

type CategoryResponse = {
  id: number;
  name: string;
};

function SideBar() {
  const axiosGuest = useAxios(false);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosGuest.get("/categories");
        const formatted: string[] = res.data.map(
          (c: CategoryResponse) => c.name,
        );
        setCategories(formatted);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, [axiosGuest]);

  return (
    <div className="flex flex-1 flex-col min-h-full min-w-[300px] max-w-[300px] bg-gray-200 p-8 gap-2">
      <h2 className="text-2xl yeseva">Filters</h2>

      <h3 className="text-xl noto">Category</h3>
      <Select placeholder="Select category..." items={categories} />

      <h3 className="text-xl noto mt-2">Price</h3>
      <div className="flex gap-2">
        <Input placeholder="From" customClasses="bg-white" type="number" />
        <Input placeholder="To" customClasses="bg-white" type="number" />
      </div>

      <h3 className="text-xl noto">Starts</h3>
      <Input type="date" />

      <h3 className="text-xl noto mt-2">Ends</h3>
      <Input type="date" />

      <Button customClasses="mt-4" variant="secondary">
        Apply filters
      </Button>
    </div>
  );
}

export default SideBar;
