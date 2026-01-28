import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="text-center">

        <h1 className="mb-4">Welcome</h1>

        <div className="d-flex gap-3 justify-content-center">
          <button
            className="btn btn-primary px-4"
            onClick={() => navigate("/signin")}
          >
            로그인
          </button>

          <button
            className="btn btn-outline-primary px-4"
            onClick={() => navigate("/signup")}
          >
            회원가입
          </button>
        </div>

      </div>
    </div>
  );
};

export default Home;
