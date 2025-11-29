import { useState, useEffect } from "react";
import Input from "./Input.tsx";
import DropdownMenu from "./DropdownMenu.tsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth.tsx";

function Header() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [searchParams] = useSearchParams();

  const [localSearch, setLocalSearch] = useState(
    searchParams.get("searchQuery") || "",
  );

  useEffect(() => {
    setLocalSearch(searchParams.get("searchQuery") || "");
  }, [searchParams]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    const newParams = new URLSearchParams(searchParams);

    if (localSearch.trim()) {
      newParams.set("searchQuery", localSearch);
    } else {
      newParams.delete("searchQuery");
    }

    navigate({ pathname: "/", search: newParams.toString() });
  };

  const profileOptions = token
    ? [
        {
          label: "Settings",
          onClick: () => navigate("/profile-settings"),
        },
        {
          label: "Logout",
          onClick: () => {
            logout();
            navigate("/login");
          },
        },
      ]
    : [
        { label: "Login", onClick: () => navigate("/login") },
        { label: "Register", onClick: () => navigate("/register") },
      ];

  return (
    <div className="bg-gray-300 w-full sticky top-0 z-50 shadow-sm">
      <div className="primary-container py-2 items-center grid grid-cols-[300px_1fr_300px]">
        <h1
          className="text-center text-3xl font-bold yeseva cursor-pointer"
          onClick={() => {
            setLocalSearch("");
            navigate("/");
          }}
        >
          BidBout
        </h1>

        <form onSubmit={handleSearchSubmit} className="relative w-full group">
          <Input
            type="search"
            placeholder="Search lots..."
            customClasses="bg-white pr-10"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </form>

        <div className="flex w-full justify-between gap-4 px-[20%]">
          <DropdownMenu
            placeholder="Sell"
            options={[
              { label: "My Lots", onClick: () => navigate("/my-lots") },
              {
                label: "Create Lot",
                onClick: () => navigate("/lot-settings"),
              },
            ]}
          />
          <DropdownMenu placeholder="Profile" options={profileOptions} />
        </div>
      </div>
    </div>
  );
}

export default Header;
