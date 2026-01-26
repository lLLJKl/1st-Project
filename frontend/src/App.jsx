import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import EnergyData from "@/pages/EnergyData";
import EmissionData from "@/pages/EmissionData";
import CostData from "@/pages/CostData";
import Signin from "@/pages/Signin";
import FindPassword from "@/pages/FindPassword"


function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/Signin" element={<Signin />} />
          <Route path="/FindPassword" element={<FindPassword />} />
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
       
