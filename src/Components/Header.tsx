import Input from "./Input.tsx";
import DropdownMenu from "./DropdownMenu.tsx";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
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
          <DropdownMenu
            placeholder="Sell"
            options={[
              { label: "My Lots", onClick: () => navigate("/") },
              {
                label: "Create Lot",
                onClick: () => navigate("/lot-settings"),
              },
            ]}
          />
          <DropdownMenu
            placeholder="Profile"
            options={[
              { label: "Login", onClick: () => navigate("/login") },
              {
                label: "Register",
                onClick: () => navigate("/register"),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default Header;
