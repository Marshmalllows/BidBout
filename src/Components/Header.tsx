import Input from "./Input.tsx";
import Button from "./Button.tsx";

function Header() {
  return (
    <div className="bg-gray-300 w-full">
      <div className="primary-container py-2 items-center grid grid-cols-[300px_1fr_300px]">
        <h1 className="text-center text-3xl font-bold yeseva">BidBout</h1>
        <Input
          type="search"
          placeholder="Search here..."
          customClasses="bg-white"
        />
        <div className="flex w-full justify-between gap-4 px-[20%]">
          <Button variant="borderless">Sell</Button>
          <Button variant="borderless">Profile</Button>
        </div>
      </div>
    </div>
  );
}

export default Header;
