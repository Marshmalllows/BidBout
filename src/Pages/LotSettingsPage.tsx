import Header from "../Components/Header.tsx";
import Input from "../Components/Input.tsx";
import Button from "../Components/Button.tsx";
import Select from "../Components/Select.tsx";
import TextArea from "../Components/TextArea.tsx";
import ImageUploader from "../Components/ImageUploader.tsx";
import { useAxios } from "../API/AxiosInstance.ts";
import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AxiosError } from "axios";

type CategoryResponse = {
  id: number;
  name: string;
};

type ValidationErrors = {
  [key: string]: string;
};

function LotSettingsPage() {
  const { id } = useParams();
  const isEditMode = !!id;

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
  const [existingImages, setExistingImages] = useState<
    { id: number; imageData: string }[]
  >([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

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

  useEffect(() => {
    if (isEditMode) return;
    const fetchUserLocation = async () => {
      try {
        const res = await axiosAuth.get("/user/me");
        const parts = [];
        if (res.data.region) parts.push(res.data.region);
        if (res.data.city) parts.push(res.data.city);
        if (parts.length > 0) setPickupPlace(parts.join(", "));
      } catch (err) {
        console.error("Failed to fetch user location:", err);
      }
    };
    fetchUserLocation();
  }, [isEditMode, axiosAuth]);

  useEffect(() => {
    if (!isEditMode) return;
    const fetchLotData = async () => {
      try {
        const res = await axiosAuth.get(`/lots/${id}`);
        const lot = res.data;
        setTitle(lot.title);
        setPickupPlace(lot.pickupPlace);
        setDescription(lot.description || "");
        const startObj = new Date(lot.startDate);
        setStartDate(startObj.toISOString().split("T")[0]);
        const endObj = new Date(lot.endDate);
        const diffTime = Math.abs(endObj.getTime() - startObj.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDuration(diffDays.toString());
        setReservePrice(lot.reservePrice ? lot.reservePrice.toString() : "");
        setExistingImages(lot.images);
        setDeletedImageIds([]);
        if (lot.category) {
          setCategory({ id: lot.category.id, name: lot.category.name });
        }
      } catch (err) {
        console.error("Failed to fetch lot details:", err);
        navigate("/my-lots");
      }
    };
    fetchLotData();
  }, [isEditMode, id, axiosAuth, navigate]);

  const clearError = (field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleRemoveExistingImage = (imageId: number) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    setDeletedImageIds((prev) => [...prev, imageId]);
  };

  const borderClass = (fieldName: string) =>
    errors[fieldName] ? "border-red-500" : "border-white";

  const validate = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};
    if (!title.trim()) newErrors.title = "Enter title";
    else if (title.length > 100) newErrors.title = "Max 100 chars";
    if (!category) newErrors.category = "Select category";
    if (!pickupPlace.trim()) newErrors.pickupPlace = "Enter pickup place";
    else if (pickupPlace.length > 100) newErrors.pickupPlace = "Max 100 chars";
    if (!startDate) newErrors.startDate = "Select start date";
    else {
      const selectedDate = new Date(startDate);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      if (selectedDate < now) newErrors.startDate = "Date cannot be past";
    }
    if (!duration) newErrors.duration = "Enter duration";
    else {
      const days = Number(duration);
      if (days <= 0 || days > 30) newErrors.duration = "1-30 days";
    }
    if (reservePrice && Number(reservePrice) < 0)
      newErrors.reservePrice = "Cannot be negative";
    const hasImages = images.length > 0 || existingImages.length > 0;
    if (!hasImages) newErrors.images = "Image required";
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
    if (isEditMode) {
      deletedImageIds.forEach((id) =>
        fd.append("DeletedImageIds", id.toString()),
      );
    }
    try {
      if (isEditMode) {
        await axiosAuth.put(`/lots/${id}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axiosAuth.post("/lots", fd, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
      }
      navigate("/my-lots");
    } catch (error) {
      const serverError =
        error instanceof AxiosError
          ? error.response?.data?.message ||
            error.response?.data ||
            "Server error"
          : "Unknown error";
      setErrors({
        server:
          typeof serverError === "string"
            ? serverError
            : JSON.stringify(serverError),
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      <Header />
      <div className="max-w-[1100px] w-full mx-auto my-6 px-4 md:px-24">
        <h1 className="yeseva text-3xl">
          {isEditMode ? "Edit Lot" : "Create new lot"}
        </h1>
      </div>
      <div className="bg-gray-200 w-full mb-20 flex-1 pb-10">
        <div className="max-w-[1100px] w-full mx-auto my-6 bg-gray-200 px-4 md:px-24">
          {errors.server && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {errors.server}
            </div>
          )}

          <h3 className="noto text-2xl mb-8">Lot information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-x-4 md:gap-y-6 mb-6 md:mb-6">
            <div>
              <Input
                type="text"
                placeholder="Item name*"
                customClasses={`bg-white border ${borderClass("title")}`}
                value={title}
                maxLength={100}
                onChange={(e) => {
                  setTitle(e.target.value);
                  clearError("title");
                }}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div className="w-full">
              <Select
                placeholder="Select category*"
                items={categories}
                value={category}
                onChange={(val) => {
                  setCategory(val);
                  clearError("category");
                }}
                customClasses={`border h-[52px] ${borderClass("category")}`}
              />
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>
          </div>

          <div className="mb-6 md:mb-6">
            <Input
              type="text"
              placeholder="Pick-up place*"
              customClasses={`bg-white w-full border ${borderClass("pickupPlace")}`}
              value={pickupPlace}
              maxLength={100}
              onChange={(e) => {
                setPickupPlace(e.target.value);
                clearError("pickupPlace");
              }}
            />
            {errors.pickupPlace && (
              <p className="text-red-500 text-sm mt-1">{errors.pickupPlace}</p>
            )}
          </div>

          <div className="mb-6 md:mb-6">
            <TextArea
              placeholder="Description"
              customClasses="bg-white"
              value={description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
            />
          </div>

          <h3 className="noto text-2xl mt-8 mb-4">Auction settings</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-x-4 md:gap-y-6 items-end mb-6 md:mb-6">
            <div>
              <label className="noto text-sm text-gray-600 mb-1 block">
                Starting date*
              </label>
              <Input
                type="date"
                min={today}
                customClasses={`bg-white border ${borderClass("startDate")}`}
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  clearError("startDate");
                }}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
              )}
            </div>

            <div className="relative">
              <Input
                type="number"
                placeholder="Days duration"
                customClasses={`bg-white border ${borderClass("duration")}`}
                value={duration}
                onChange={(e) => {
                  setDuration(e.target.value);
                  clearError("duration");
                }}
              />
              {errors.duration && (
                <p className="text-red-500 text-sm mt-1 absolute top-full">
                  {errors.duration}
                </p>
              )}
            </div>
          </div>

          <div className="w-full mb-6 md:mb-4">
            <Input
              type="number"
              placeholder="Reserve price"
              customClasses={`bg-white border ${borderClass("reservePrice")}`}
              value={reservePrice}
              onChange={(e) => setReservePrice(e.target.value)}
            />
            {errors.reservePrice && (
              <p className="text-red-500 text-sm mt-1">{errors.reservePrice}</p>
            )}
          </div>

          <h3 className="noto text-2xl mb-4 mt-8">Images</h3>

          {isEditMode && existingImages.length > 0 && (
            <div className="mb-4">
              <p className="noto text-sm text-gray-500 mb-2">Current images:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                {existingImages.map((img) => (
                  <div
                    key={img.id}
                    className="relative bg-white p-2 shadow border border-gray-300"
                  >
                    <img
                      src={`data:image/jpeg;base64,${img.imageData}`}
                      alt="lot"
                      className="w-full h-40 object-cover"
                    />
                    <button
                      onClick={() => handleRemoveExistingImage(img.id)}
                      type="button"
                      className="absolute top-4 right-4 w-7 h-7 text-white/80 hover:text-white bg-black/30 transition-all hover:bg-black/50 rounded-sm flex items-center justify-center font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

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
              Check errors above.
            </div>
          )}

          <p className="noto italic mt-4 text-sm text-gray-500">
            Fields ending with "*" are required!
          </p>

          <Button
            customClasses="mt-8 mb-6 w-full md:w-auto px-10"
            variant="secondary"
            onClick={handleSubmit}
          >
            {isEditMode ? "Save changes" : "Create Lot"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LotSettingsPage;
