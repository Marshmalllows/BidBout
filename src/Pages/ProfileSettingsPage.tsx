import Header from "../Components/Header.tsx";
import Input from "../Components/Input.tsx";
import Button from "../Components/Button.tsx";
import { useAxios } from "../API/AxiosInstance.ts";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth.tsx";

interface UserProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  region: string;
  city: string;
}

type ValidationErrors = {
  [key: string]: string;
};

function ProfileSettingsPage() {
  const axiosAuth = useAxios(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState<UserProfileData>({
    firstName: "",
    lastName: "",
    phone: "",
    region: "",
    city: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axiosAuth.get("/user/me");
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phone: data.phone || "",
          region: data.region || "",
          city: data.city || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [axiosAuth]);

  const handleChange = (field: keyof UserProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field] || errors.server) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        delete newErrors.server;
        return newErrors;
      });
    }
  };

  const validate = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    if (formData.firstName && formData.firstName.length > 50) {
      newErrors.firstName = "First name is too long (max 50 chars)";
    }

    if (formData.lastName && formData.lastName.length > 50) {
      newErrors.lastName = "Last name is too long (max 50 chars)";
    }

    if (formData.phone) {
      const phoneRegex = /^\+?[0-9]{10,15}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = "Invalid phone format (e.g. +380123456789)";
      }
    }

    if (formData.region && formData.region.length > 100) {
      newErrors.region = "Region name is too long";
    }

    if (formData.city && formData.city.length > 100) {
      newErrors.city = "City name is too long";
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    setErrors({});
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axiosAuth.put("/user/me", formData);
      if (user?.id) {
        navigate(`/seller/${user.id}`);
      } else {
        navigate("/");
      }
    } catch (error) {
      const msg =
        error instanceof AxiosError
          ? error.response?.data?.message ||
            error.response?.data ||
            "Failed to update profile"
          : "Unknown error";
      const errorText =
        typeof msg === "object" ? JSON.stringify(msg) : String(msg);
      setErrors({ server: errorText });
    }
  };

  const borderClass = (fieldName: string) =>
    errors[fieldName] ? "border-red-500" : "border-white";

  if (isLoading) {
    return (
      <div className="flex justify-center mt-10 min-h-screen items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
      <Header />
      <div className="max-w-[1100px] w-full mx-auto my-6 px-4 md:px-24">
        <h1 className="yeseva text-3xl">Profile settings</h1>
      </div>
      <div className="bg-gray-200 w-full flex-1 pb-10">
        <div className="max-w-[1100px] w-full mx-auto my-6 bg-gray-200 px-4 md:px-24">
          <h3 className="yeseva noto text-2xl mb-6">Public info</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-4 mb-6 items-start">
            <div className="w-full">
              <Input
                type="text"
                placeholder="First name"
                customClasses={`bg-white border ${borderClass("firstName")}`}
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
            </div>
            <div className="w-full">
              <Input
                type="text"
                placeholder="Last name"
                customClasses={`bg-white border ${borderClass("lastName")}`}
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
            </div>
          </div>

          <h3 className="yeseva noto text-2xl mt-6 mb-6">Contacts</h3>
          <div className="mb-6 w-full">
            <Input
              type="text"
              placeholder="Phone number"
              customClasses={`bg-white border ${borderClass("phone")}`}
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>

          <h3 className="yeseva noto text-2xl mt-6 mb-6">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 md:gap-4 mb-6 items-start">
            <div className="w-full">
              <Input
                type="text"
                placeholder="Region"
                customClasses={`bg-white border ${borderClass("region")}`}
                value={formData.region}
                onChange={(e) => handleChange("region", e.target.value)}
              />
            </div>
            <div className="w-full">
              <Input
                type="text"
                placeholder="City"
                customClasses={`bg-white border ${borderClass("city")}`}
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
              />
            </div>
          </div>

          {Object.keys(errors).length > 0 && (
            <div className="noto text-red-600 mt-3 text-lg">
              {Object.values(errors).map((err, idx) => (
                <p key={idx}>{err}</p>
              ))}
            </div>
          )}

          <Button
            customClasses="mt-8 mb-6 w-full px-10"
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

export default ProfileSettingsPage;
