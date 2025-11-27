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

type ValidationErrors = {
  [key: string]: string;
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

  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosGuest.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, [axiosGuest]);

  const clearError = (field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const validate = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    if (!title.trim()) newErrors.title = "Enter title";
    if (!category) newErrors.category = "Select category";
    if (!pickupPlace.trim()) newErrors.pickupPlace = "Enter pickup place";
    if (!startDate) newErrors.startDate = "Select start date";
    if (!duration) newErrors.duration = "Enter duration";
    if (images.length === 0) newErrors.images = "Upload at least one image";

    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    const fd = new FormData();
    fd.append("Title", title);
    fd.append("CategoryId", category!.id.toString());
    fd.append("PickupPlace", pickupPlace);
    fd.append("Description", description);

    const dateObj = new Date(startDate);
    const utcDate = new Date(
      Date.UTC(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate(),
        0,
        0,
        0,
      ),
    );

    fd.append("StartDate", utcDate.toISOString());

    fd.append("Duration", Number(duration).toString());
    fd.append(
      "ReservePrice",
      reservePrice ? Number(reservePrice).toString() : "0",
    );

    images.forEach((img) => fd.append("Images", img));

    try {
      await axiosAuth.post("/lots", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      navigate("/");
    } catch (error) {
      const serverError =
        error instanceof AxiosError
          ? error.response?.data?.message || "Server error"
          : "Unknown error";

      setErrors({ server: serverError });
    }
  };

  const borderClass = (fieldName: string) =>
    errors[fieldName] ? "border-red-500" : "border-white";

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <div className="max-w-[1100px] w-full mx-auto my-6 px-24">
        <h1 className="yeseva text-3xl">Create new lot</h1>
      </div>
      <div className="bg-gray-200 w-full mb-20">
        <div className="max-w-[1100px] w-full mx-auto my-6 bg-gray-200 px-24">
          <h3 className="noto text-2xl">Lot information</h3>
          <div className="flex gap-2 my-2">
            <Input
              type="text"
              placeholder="Item name*"
              customClasses={`bg-white border ${borderClass("title")}`}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                clearError("title");
              }}
            />
            <div className="mt-4 w-full">
              <Select
                placeholder="Select category*"
                items={categories}
                value={category}
                onChange={(val) => {
                  setCategory(val);
                  clearError("category");
                }}
                customClasses={`border ${borderClass("category")}`}
              />
            </div>
          </div>
          <Input
            type="text"
            placeholder="Pick-up place*"
            customClasses={`bg-white w-1/2 border ${borderClass(
              "pickupPlace",
            )}`}
            value={pickupPlace}
            onChange={(e) => {
              setPickupPlace(e.target.value);
              clearError("pickupPlace");
            }}
          />
          <TextArea
            placeholder="Description"
            customClasses="bg-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <h3 className="noto text-2xl mt-6">Auction settings</h3>
          <div className="flex gap-2 my-2 relative">
            <Input
              type="date"
              customClasses={`bg-white border mt-4 ${borderClass("startDate")}`}
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                clearError("startDate");
              }}
            />
            <Input
              type="number"
              placeholder="Days duration*"
              customClasses={`bg-white border ${borderClass("duration")}`}
              value={duration}
              onChange={(e) => {
                setDuration(e.target.value);
                clearError("duration");
              }}
            />
            <label className="noto absolute -top-3">Starting date*</label>
          </div>
          <Input
            type="number"
            placeholder="Reserve price"
            customClasses="bg-white w-1/2"
            value={reservePrice}
            onChange={(e) => setReservePrice(e.target.value)}
          />
          <h3 className="noto text-2xl mb-4 mt-4">Images</h3>
          <div className={errors.images ? "border-2 border-red-500 p-2" : ""}>
            <ImageUploader
              onFilesChange={(files) => {
                setImages(files);
                clearError("images");
              }}
            />
          </div>
          {Object.keys(errors).length > 0 && (
            <div className="noto text-red-600 mt-3 text-lg">
              {Object.values(errors).map((err, idx) => (
                <p key={idx}>{err}</p>
              ))}
            </div>
          )}
          <p className="noto italic mt-4">
            Fields ending with "*" are required!
          </p>
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
