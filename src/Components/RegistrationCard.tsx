import Button from "./Button.tsx";
import Input from "./Input.tsx";

function RegistrationCard() {
  return (
    <div className="z-1 flex flex-col bg-white p-6 justify-center shadow-md border-1 border-gray-300 rounded-xs w-80 sm:w-120">
      <h1 className="text-center text-3xl font-bold mb-6 yeseva">BidBout</h1>
      <p className="mb-4 noto text-lg">Enter your info</p>
      <Input variant="form" placeholder="Email..." />
      <Input variant="form" placeholder="Password..." type="password" />
      <Input variant="form" placeholder="Confirm password..." type="password" />
      <Button>Register</Button>
      <p className="mt-2 mb-12 noto italic text-base">
        Have an existing account?{" "}
        <a href="https://pasiura.com/" className="underline">
          Log in now!
        </a>
      </p>
    </div>
  );
}

export default RegistrationCard;
