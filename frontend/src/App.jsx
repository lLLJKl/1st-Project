import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import EnergyData from "@/pages/EnergyData";
import EmissionData from "@/pages/EmissionData";
import CostData from "@/pages/CostData";
import Login from "@/pages/Login";
import FindPassword from "@/pages/FindPassword";
import MyPage from "@/pages/Mypage";


function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/find-password" element={<FindPassword />} />
          <Route path="/mypage" element={<MyPage />} />
        {/* <Route path="/projects" element={<Projects />} /> */}
        {/* <Route path="/projects/new" element={<ProjectCreate />} /> */}

        {/* 데이터셋 */}
        <Route path="/data/energy" element={<EnergyData />} />
        <Route path="/data/emission" element={<EmissionData />} />
        <Route path="/data/cost" element={<CostData />} />
        </Route>       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
