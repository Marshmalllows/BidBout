import Button from "./Button.tsx";
import Input from "./Input.tsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Hooks/UseAuth.tsx";
import { useAxios } from "../API/AxiosInstance.ts";
import { useState } from "react";
import axios from "axios";

function RegistrationCard() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const axiosInstance = useAxios();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setError("Email and password are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setError(null);

      await axiosInstance.post(
        "/auth/register",
        { Email: email, Password: password },
        { headers: { Authorization: "" } },
      );

      const loginResponse = await axiosInstance.post(
        "/auth/login",
        { Email: email, Password: password },
        { headers: { Authorization: "" } },
      );

      const { token, user } = loginResponse.data;
      login(user, token);
      navigate("/");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const message = err.response?.data?.message;

        if (status === 409 || message?.includes("exists")) {
          setError("User with this email already exists");
        } else {
          setError(message || "Registration or login failed. Please try again");
        }

        console.error("Auth error:", {
          status,
          data: err.response?.data,
          message: err.message,
        });
      } else {
        console.error("Unexpected error:", err);
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className="z-1 flex flex-col bg-white p-6 justify-center shadow-md border-1 border-gray-300 rounded-xs w-80 sm:w-120">
      <h1 className="text-center text-3xl font-bold mb-8 yeseva">BidBout</h1>
      <p className="mb-2 noto text-lg">Enter your info</p>
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
      <Input
        placeholder="Confirm password..."
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Button customClasses="mb-4" onClick={handleRegister}>
        Register
      </Button>
      {error && <p className="text-red-600 mb-2 noto">{error}</p>}
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
