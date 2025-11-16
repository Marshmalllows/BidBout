import { Route, Routes } from "react-router-dom";
import MainPage from "./Pages/MainPage.tsx";
import LoginPage from "./Pages/LoginPage.tsx";
import LotSettingsPage from "./Pages/LotSettingsPage.tsx";
import ProfileSettingsPage from "./Pages/ProfileSettingsPage.tsx";
import LotDetailsPage from "./Pages/LotDetailsPage.tsx";
import RegisterPage from "./Pages/RegisterPage.tsx";
import { useAutoLogin } from "./Hooks/useAutoLogin.tsx";

function App() {
  const loading = useAutoLogin();

  if (loading) {
    return <div>Loading...</div>; // або спіннер
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="/lot-settings" element={<LotSettingsPage />} />
        <Route path="/profile-settings" element={<ProfileSettingsPage />} />
        <Route path="/lot/:id" element={<LotDetailsPage />} />
      </Routes>
    </div>
  );
}

export default App;
