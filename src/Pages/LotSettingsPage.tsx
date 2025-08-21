import Header from "../Components/Header.tsx";
import Input from "../Components/Input.tsx";
import Button from "../Components/Button.tsx";
import Select from "../Components/Select.tsx";
import TextArea from "../Components/TextArea.tsx";
import ImageUploader from "../Components/ImageUploader.tsx";

function LotSettingsPage() {
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
            />
            <div className="mt-4 w-full">
              <Select placeholder="Select category" />
            </div>
          </div>
          <TextArea placeholder="Description" customClasses="bg-white" />
          <h3 className="yeseva noto text-2xl">Auction settings</h3>
          <div className="flex gap-2 my-2">
            <Input
              type="date"
              placeholder="Starting date"
              customClasses="bg-white mt-4"
            />
            <Input
              type="number"
              placeholder="Duration (days)"
              customClasses="bg-white"
            />
          </div>
          <Input
            type="number"
            placeholder="Minimum bet"
            customClasses="bg-white w-1/2"
          />
          <h3 className="yeseva noto text-2xl mb-4">Images</h3>
          <ImageUploader />
          <Button customClasses="my-4" variant="secondary">
            Apply changes
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LotSettingsPage;
