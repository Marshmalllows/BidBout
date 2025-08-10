import RegistrationCard from "../Components/RegistrationCard.tsx";

function Register() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 bg-white" />
      <div className="flex h-96 bg-gray-200 items-center justify-center">
        <RegistrationCard />
      </div>
      <div className="flex-1 bg-white" />
    </div>
  );
}

export default Register;
