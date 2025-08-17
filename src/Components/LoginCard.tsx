import Button from "./Button.tsx";
import Input from "./Input.tsx";

function LoginCard() {
  return (
    <div className="z-1 flex flex-col bg-white p-6 justify-center shadow-md border-1 border-gray-300 rounded-xs w-80 sm:w-120">
      <h1 className="text-center text-3xl font-bold mb-8 yeseva">BidBout</h1>
      <p className="mb-2 noto text-lg">Enter your login info</p>
      <Input placeholder="Email..." />
      <Input placeholder="Password..." type="password" />
      <Button>Log in</Button>
      <p className="my-2 sm:text-base text-sm italic noto">
        Don`t have an account?{" "}
        <a href="https://halyamov.vercel.app/" className="underline">
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
