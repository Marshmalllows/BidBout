import { Route, Routes } from "react-router-dom";
import MainPage from "./Pages/MainPage.tsx";
import LoginPage from "./Pages/LoginPage.tsx";
import LotSettingsPage from "./Pages/LotSettingsPage.tsx";
import ProfileSettingsPage from "./Pages/ProfileSettingsPage.tsx";
import LotDetailsPage from "./Pages/LotDetailsPage.tsx";
import RegisterPage from "./Pages/RegisterPage.tsx";
import { useAutoLogin } from "./Hooks/useAutoLogin.tsx";
import ProtectedRoute from "./Components/ProtectedRoute.tsx";
import { Loader } from "./Components/Loader.tsx";
import MyLotsPage from "./Pages/MyLotsPage.tsx";
import SellerReviewsPage from "./Pages/SellerReviewsPage.tsx";

function App() {
  const loading = useAutoLogin();

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Loader />{" "}
      </div>
    );
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/lot/:id" element={<LotDetailsPage />} />
        <Route path="/seller/:id" element={<SellerReviewsPage />} />

        <Route
          path="/lot-settings/:id?"
          element={
            <ProtectedRoute loading={loading}>
              <LotSettingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-lots"
          element={
            <ProtectedRoute loading={loading}>
              <MyLotsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile-settings"
          element={
            <ProtectedRoute loading={loading}>
              <ProfileSettingsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
