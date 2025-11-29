import Header from "../Components/Header.tsx";
import Input from "../Components/Input.tsx";
import Button from "../Components/Button.tsx";
import Select from "../Components/Select.tsx";
import TextArea from "../Components/TextArea.tsx";
import ImageUploader from "../Components/ImageUploader.tsx";
import { useAxios } from "../API/AxiosInstance.ts";
import { useEffect, useState } from "react";
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
    if (!isEditMode) return;

    const fetchLotData = async () => {
      try {
        const res = await axiosAuth.get(`/lots/${id}`);
        const lot = res.data;

        setTitle(lot.title);
        setPickupPlace(lot.pickupPlace);
        setDescription(lot.description);

        const startObj = new Date(lot.startDate);
        const isoDate = startObj.toISOString().split("T")[0];
        setStartDate(isoDate);

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

  const validate = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    if (!title.trim()) newErrors.title = "Enter title";
    if (!category) newErrors.category = "Select category";
    if (!pickupPlace.trim()) newErrors.pickupPlace = "Enter pickup place";
    if (!startDate) newErrors.startDate = "Select start date";
    if (!duration) newErrors.duration = "Enter duration";

    const hasImages = images.length > 0 || existingImages.length > 0;
    if (!hasImages) newErrors.images = "Lot must have at least one image";

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

      setErrors({ server: serverError });
    }
  };

  const borderClass = (fieldName: string) =>
    errors[fieldName] ? "border-red-500" : "border-white";

  return (
    <div className="flex flex-col min-h-screen bg-white">
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
            customClasses={`bg-white w-1/2 border ${borderClass("pickupPlace")}`}
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
                      className="w-80 h-60 object-cover"
                    />
                    <button
                      onClick={() => handleRemoveExistingImage(img.id)}
                      type="button"
                      className="absolute top-4 right-4 w-7 h-7 text-white/80 hover:text-white bg-black/30 transition-all hover:bg-black/50 rounded-sm p-px flex items-center justify-center font-bold"
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
            {isEditMode ? "Save changes" : "Create Lot"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LotSettingsPage;
