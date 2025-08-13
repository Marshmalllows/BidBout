import Button from "./Button.tsx";
import Input from "./Input.tsx";

function LoginCard() {
  return (
    <div className="z-1 flex flex-col bg-white p-6 justify-center shadow-md border-1 border-gray-300 rounded-xs w-80 sm:w-120">
      <h1 className="text-center text-3xl font-bold mb-6 yeseva">BidBout</h1>
      <p className="mb-4 noto text-lg">Enter your login info</p>
      <Input variant="form" placeholder="Email..." />
      <Input variant="form" placeholder="Password..." type="password" />
      <Button>Log in</Button>
      <p className="my-2 text-base italic noto">
        Don`t have an account?{" "}
        <a href="https://halyamov.vercel.app/" className="underline">
          Create one!
        </a>
      </p>
      <p className="mt-2 mb-12 text-base italic noto text-end">
        Forgot your password?{" "}
        <a href="https://halyamov.vercel.app/" className="underline">
          Not a problem!
        </a>
      </p>
    </div>
  );
}

export default LoginCard;
