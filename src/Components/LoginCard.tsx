import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button.tsx";
import Input from "./Input.tsx";
import { useAuth } from "../Hooks/UseAuth.tsx";
import { useAxios } from "../API/AxiosInstance.ts";

function LoginCard() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const axiosInstance = useAxios();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    console.log("Sending login request with:", {
      Email: email,
      Password: password,
    });
    try {
      setError(null);
      const response = await axiosInstance.post(
        "/auth/login",
        { Email: email, Password: password }, // Використовуємо Email і Password
        { headers: { Authorization: "" } }, // Вимикаємо Authorization
      );
      const { token, user } = response.data;
      login(user, token);
      navigate("/");
    } catch (err: any) {
      console.error("Login error:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    }
  };

  return (
    <div className="z-1 flex flex-col bg-white p-6 justify-center shadow-md border-1 border-gray-300 rounded-xs w-80 sm:w-120">
      <h1 className="text-center text-3xl font-bold mb-8 yeseva">BidBout</h1>
      <p className="mb-2 noto text-lg">Enter your login info</p>
      {error && <p className="text-red-500 text-sm mb-2 noto">{error}</p>}
      <Input
        placeholder="Email..."
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="Password..."
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button customClasses="mb-4" onClick={handleLogin}>
        Log in
      </Button>
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
