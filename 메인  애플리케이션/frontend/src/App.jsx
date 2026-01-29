import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import MainLayout from "@/layouts/MainLayout";
import Mainp from "@/pages/mainp";
import EnergyData from "@/pages/EnergyData";
import EmissionData from "@/pages/EmissionData";
import CostData from "@/pages/CostData";
import Signin from "@/pages/Signin";
import MyPage from "@/pages/Mypage";
import Signup from "@/pages/SignUp";
import P1_NetZeroRoad from "@/pages/project/P1_NetZeroRoad.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/Signup" element={<Signup />} />
        <Route element={<MainLayout />}>
          <Route path="/main" element={<Mainp />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/projects/roadmap" element={<P1_NetZeroRoad />} />
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
