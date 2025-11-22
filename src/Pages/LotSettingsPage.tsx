import Header from "../Components/Header.tsx";
import Input from "../Components/Input.tsx";
import Button from "../Components/Button.tsx";
import Select from "../Components/Select.tsx";
import TextArea from "../Components/TextArea.tsx";
import ImageUploader from "../Components/ImageUploader.tsx";
import { useAxios } from "../API/AxiosInstance.ts";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

type CategoryResponse = {
  id: number;
  name: string;
};

function LotSettingsPage() {
  const axiosAuth = useAxios(true);
  const axiosGuest = useAxios(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<CategoryResponse | undefined>();
  const [pickupPlace, setPickupPlace] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState("");
  const [reservePrice, setReservePrice] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [errors, setErrors] = useState<Record<string, unknown>>({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosGuest.get("/categories");
        const formatted: CategoryResponse[] = res.data.map(
          (c: CategoryResponse) => ({ id: c.id, name: c.name }),
        );
        setCategories(formatted);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, [axiosGuest]);

  const handleSubmit = async () => {
    if (!category) {
      setErrors({ ...errors, image: ["Select Category"] });
      return;
    }

    const fd = new FormData();
    fd.append("title", title);
    fd.append("categoryId", category.id.toString());
    fd.append("pickupPlace", pickupPlace);
    fd.append("description", description);
    fd.append("startDate", startDate);
    fd.append("duration", duration);
    fd.append("reservePrice", reservePrice);

    if (images.length === 0) {
      setErrors({ ...errors, image: ["Upload at least one image"] });
      return;
    }

    images.forEach((img) => fd.append("images", img));

    await axiosAuth
      .post("/lots", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        const errorsValidated =
          error instanceof AxiosError
            ? error.response?.data.errors
            : { message: JSON.stringify(error.message) };
        console.log(errorsValidated);
        setErrors(errorsValidated);
      });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <div className="max-w-[1100px] w-full mx-auto my-6 px-24">
        <h1 className="yeseva text-3xl">Create new lot</h1>
      </div>
      <div className="bg-gray-200 w-full mb-20">
        <div className="max-w-[1100px] w-full mx-auto my-6 bg-gray-200 px-24">
          <h3 className="yeseva noto text-2xl">Lot information</h3>
          <div className="flex gap-2 my-2">
            <Input
              type="text"
              placeholder="Item name"
              customClasses="bg-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="mt-4 w-full">
              <Select
                placeholder="Select category..."
                items={categories}
                value={category}
                onChange={(value) => setCategory(value)}
              />
            </div>
          </div>
          <Input
            type="text"
            placeholder="Pick-up place"
            customClasses="bg-white w-1/2"
            value={pickupPlace}
            onChange={(e) => setPickupPlace(e.target.value)}
          />
          <TextArea
            placeholder="Description"
            customClasses="bg-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <h3 className="yeseva noto text-2xl">Auction settings</h3>
          <div className="flex gap-2 my-2 relative">
            <Input
              type="date"
              customClasses="bg-white mt-4"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Duration (days)"
              customClasses="bg-white"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
            <label className="noto absolute -top-3">Starting date</label>
          </div>
          <Input
            type="number"
            placeholder="Reserve price"
            customClasses="bg-white w-1/2"
            value={reservePrice}
            onChange={(e) => setReservePrice(e.target.value)}
          />
          <h3 className="yeseva noto text-2xl mb-4">Images</h3>
          <ImageUploader onFilesChange={setImages} />
          {Object.keys(errors).length > 0 && (
            <div className="flex flex-col gap-0.5 mt-4">
              {Object.values(errors).map((error) => {
                if (error instanceof Array)
                  return <p className="text-red-600">{error.join(", ")}</p>;
                return <p className="text-red-600">{JSON.stringify(error)}</p>;
              })}
            </div>
          )}
          <Button
            customClasses="my-4"
            variant="secondary"
            onClick={handleSubmit}
          >
            Apply changes
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LotSettingsPage;
