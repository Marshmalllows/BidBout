import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button.tsx";
import Input from "./Input.tsx";
import { useAuth } from "../Hooks/useAuth.tsx";
import { useAxios } from "../API/AxiosInstance.ts";
import axios from "axios";
import * as UAParser from "ua-parser-js";

function LoginCard() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const axiosInstance = useAxios();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }

    if (password.length < 5) {
      setError("Password must be at least 5 characters long");
      return;
    }

    try {
      const parser = new UAParser.UAParser();
      const device = parser.getResult();

      const deviceInfo = {
        deviceType: device.device.type || "desktop",
        browser: device.browser.name || "unknown",
        os: device.os.name || "unknown",
      };

      const response = await axiosInstance.post(
        "/auth/login",
        {
          Email: email,
          Password: password,
          ...deviceInfo,
        },
        { headers: { Authorization: "" } },
      );

      const { token, user } = response.data;
      login(user, token);
      navigate("/");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Login error:", {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        });
        setError(
          err.response?.data?.message || "Login failed. Please try again",
        );
      } else {
        console.error("Unexpected error:", err);
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className="z-1 flex flex-col bg-white p-6 justify-center shadow-md border-1 border-gray-300 rounded-xs w-80 sm:w-120">
      <h1
        className="text-center text-3xl font-bold mb-8 yeseva cursor-pointer"
        onClick={() => navigate("/")}
      >
        BidBout
      </h1>
      <p className="mb-6 noto text-lg">Enter your login info</p>

      <form onSubmit={handleLogin} className="flex flex-col w-full gap-6">
        <Input
          placeholder="Email..."
          type="text"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(null);
          }}
        />
        <Input
          placeholder="Password..."
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(null);
          }}
        />
        <Button customClasses="mb-4" type="submit">
          Log in
        </Button>
      </form>

      {error && <p className="text-red-600 mb-2 noto">{error}</p>}
      <p className="my-2 mb-12 sm:text-base text-sm italic noto">
        Don`t have an account?{" "}
        <a
          onClick={() => navigate("/register")}
          className="underline hover:cursor-pointer"
        >
          Create one!
        </a>
      </p>
    </div>
  );
}

export default LoginCard;
