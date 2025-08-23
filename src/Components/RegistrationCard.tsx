import Button from "./Button.tsx";
import Input from "./Input.tsx";
import { useNavigate } from "react-router-dom";

function RegistrationCard() {
  const navigate = useNavigate();
  return (
    <div className="z-1 flex flex-col bg-white p-6 justify-center shadow-md border-1 border-gray-300 rounded-xs w-80 sm:w-120">
      <h1 className="text-center text-3xl font-bold mb-8 yeseva">BidBout</h1>
      <p className="mb-2 noto text-lg">Enter your info</p>
      <Input placeholder="Email..." />
      <Input placeholder="Password..." type="password" />
      <Input placeholder="Confirm password..." type="password" />
      <Button customClasses="mb-4">Register</Button>
      <p className="mt-2 mb-12 noto italic sm:text-base text-sm">
        Have an existing account?{" "}
        <a
          onClick={() => navigate("/login")}
          className="underline hover:cursor-pointer"
        >
          Log in now!
        </a>
      </p>
    </div>
  );
}

export default RegistrationCard;
