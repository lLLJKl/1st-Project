import { BrowserRouter, Routes, Route } from "react-router";
import CreateAccount from "@/components/CreateAccount/CreateAccount";
import Login from "@/components/Login/Login.jsx";
import MyPage from "../components/mypage/MyPage";


const Router = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router