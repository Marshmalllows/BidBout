import Header from "../Components/Header.tsx";
import Input from "../Components/Input.tsx";
import Button from "../Components/Button.tsx";
import { useAxios } from "../API/AxiosInstance.ts";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";

interface UserProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  region: string;
  city: string;
}

function ProfileSettingsPage() {
  const axiosAuth = useAxios(true); // true = запити з токеном

  const [formData, setFormData] = useState<UserProfileData>({
    firstName: "",
    lastName: "",
    phone: "",
    region: "",
    city: "",
  });

  const [isLoading, setIsLoading] = useState(true);

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
  };

  const handleSubmit = async () => {
    try {
      await axiosAuth.put("/user/me", formData);
      alert("Changes saved successfully!"); // Можна замінити на гарний тост/повідомлення
    } catch (error) {
      const msg =
        error instanceof AxiosError
          ? error.response?.data?.message
          : "Error updating profile";
      alert(msg);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center mt-10">Loading profile...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <div className="max-w-[1100px] w-full mx-auto my-6 px-24">
        <h1 className="yeseva text-3xl">Profile settings</h1>
      </div>
      <div className="bg-gray-200 w-full">
        <div className="max-w-[1100px] w-full mx-auto my-6 bg-gray-200 px-24 pb-10">
          <h3 className="yeseva noto text-2xl">Public info</h3>
          <div className="flex gap-2 my-2">
            <Input
              type="text"
              placeholder="First name"
              customClasses="bg-white"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
            />
            <Input
              type="text"
              placeholder="Last name"
              customClasses="bg-white"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />
          </div>

          <h3 className="yeseva noto text-2xl">Contacts</h3>
          <div className="flex gap-2 my-2">
            <Input
              type="text"
              placeholder="Phone number"
              customClasses="bg-white w-1/2"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>

          <h3 className="yeseva noto text-2xl">Location</h3>
          <div className="flex gap-2 my-2">
            <Input
              type="text"
              placeholder="Region"
              customClasses="bg-white"
              value={formData.region}
              onChange={(e) => handleChange("region", e.target.value)}
            />
            <Input
              type="text"
              placeholder="City"
              customClasses="bg-white"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
            />
          </div>
          <Button
            customClasses="my-2"
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
