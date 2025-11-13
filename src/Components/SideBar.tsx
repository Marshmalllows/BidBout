import Select from "./Select.tsx";
import Input from "./Input.tsx";
import Button from "./Button.tsx";

function SideBar() {
  return (
    <div className="flex flex-1 flex-col min-h-full w-[300px] bg-gray-200 p-8 flex flex-col gap-2">
      <h2 className="text-2xl yeseva">Filters</h2>
      <h3 className="text-xl noto">Category</h3>
      <Select placeholder="Select category..." />
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
