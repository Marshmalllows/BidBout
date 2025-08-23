import Button from "./Button.tsx";
import Input from "./Input.tsx";
import { useNavigate } from "react-router-dom";

function LoginCard() {
  const navigate = useNavigate();
  return (
    <div className="z-1 flex flex-col bg-white p-6 justify-center shadow-md border-1 border-gray-300 rounded-xs w-80 sm:w-120">
      <h1 className="text-center text-3xl font-bold mb-8 yeseva">BidBout</h1>
      <p className="mb-2 noto text-lg">Enter your login info</p>
      <Input placeholder="Email..." />
      <Input placeholder="Password..." type="password" />
      <Button customClasses="mb-4">Log in</Button>
      <p className="my-2 sm:text-base text-sm italic noto">
        Don`t have an account?{" "}
        <a
          onClick={() => navigate("/register")}
          className="underline hover:cursor-pointer"
        >
          Create one!
        </a>
      </p>
      <p className="mt-2 mb-12 italic noto text-end sm:text-base text-sm">
        Forgot your password?{" "}
        <a href="https://halyamov.vercel.app/" className="underline">
          Not a problem!
        </a>
      </p>
    </div>
  );
}

export default LoginCard;
