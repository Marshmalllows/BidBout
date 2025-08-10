import Button from "./Button.tsx";
import Input from "./Input.tsx";

function LoginCard() {
  return (
    <div className="z-1 flex flex-col bg-white p-6 justify-center shadow-md border-1 border-gray-300 rounded-xs w-80 sm:w-120">
      <h1 className="text-center text-3xl font-bold mb-8">BidBout</h1>
      <p className="my-2 italic text-lg">Enter your login info</p>
      <Input placeholder="Email..." />
      <Input placeholder="Password..." type="password" />
      <Button>Log in</Button>
      <div className="flex justify-between gap-4">
        <Button variant="secondary">Register</Button>
        <Button variant="secondary">Forgot password</Button>
      </div>
      <p className="mt-2 mb-12 italic text-md">
        Don`t have an account? Create one!
      </p>
    </div>
  );
}

export default LoginCard;
