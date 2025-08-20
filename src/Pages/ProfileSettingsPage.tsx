import Header from "../Components/Header.tsx";
import Input from "../Components/Input.tsx";
import Button from "../Components/Button.tsx";

function ProfileSettingsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <div className="max-w-[1100px] w-full mx-auto my-6 px-24">
        <h1 className="yeseva text-3xl">Profile settings</h1>
      </div>
      <div className="bg-gray-200 w-full">
        <div className="max-w-[1100px] w-full mx-auto my-6 bg-gray-200 px-24">
          <h3 className="yeseva noto text-2xl">Public info</h3>
          <div className="flex gap-2 my-2">
            <Input
              type="text"
              placeholder="First name"
              customClasses="bg-white"
            />
            <Input
              type="text"
              placeholder="Last name"
              customClasses="bg-white"
            />
          </div>
          <h3 className="yeseva noto text-2xl">Contacts</h3>
          <div className="flex gap-2 my-2">
            <Input
              type="text"
              placeholder="Phone number"
              customClasses="bg-white"
            />
            <Input type="text" placeholder="Email" customClasses="bg-white" />
          </div>
          <h3 className="yeseva noto text-2xl">Location</h3>
          <div className="flex gap-2 my-2">
            <Input type="text" placeholder="Region" customClasses="bg-white" />
            <Input type="text" placeholder="City" customClasses="bg-white" />
          </div>
          <Button customClasses="my-2" variant="secondary">
            Apply changes
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProfileSettingsPage;
