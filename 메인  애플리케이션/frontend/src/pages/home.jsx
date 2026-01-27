import { Link } from "react-router-dom";
import "@/styles/home.css";

const Home = () => {
  return (
    <div className="home-page d-flex justify-content-center align-items-center">
      <div className="text-center text-white px-3">
        <h1 className="fw-bold mb-3">
          Welcome to Our Service
        </h1>

        <p className="mb-4 text-white-50">
          로그인 후 서비스를 이용하실 수 있습니다
        </p>

        <div className="d-flex justify-content-center gap-3">
          <Link to="/login" className="btn btn-light px-4">
            로그인
          </Link>

          <Link to="/signup" className="btn btn-outline-light px-4">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
