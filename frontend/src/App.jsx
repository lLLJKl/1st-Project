import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Home from "@/pages/Home";
import P1_NetZeroRoad from "@pages/P1_NetZeroRoad.jsx";


function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
           <Route path="/projects/:projectId/roadmap" element={<P1_NetZeroRoad />} />
          {/* <Route path="/projects" element={<Projects />} /> */}
          {/* <Route path="/projects/new" element={<ProjectCreate />} /> */}
        </Route>       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
