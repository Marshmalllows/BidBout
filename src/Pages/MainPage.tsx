import Header from "../Components/Header.tsx";
import SideBar from "../Components/SideBar.tsx";

function MainPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <SideBar></SideBar>
    </div>
  );
}

export default MainPage;
