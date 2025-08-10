import LoginCard from "../Components/LoginCard.tsx";

function Login() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 bg-white" />
      <div className="flex h-96 bg-gray-200 items-center justify-center">
        <LoginCard />
      </div>
      <div className="flex-1 bg-white" />
    </div>
  );
}

export default Login;
