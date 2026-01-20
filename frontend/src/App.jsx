import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import EnergyData from "@/pages/EnergyData";
import EmissionData from "@/pages/EmissionData";
import CostData from "@/pages/CostData";


function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
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
