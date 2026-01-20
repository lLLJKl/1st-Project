
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import Inputs from "@/createAccount/Input.jsx"; // 기존에 만든 Input 컴포넌트 재사용
import Buttons from "@/createAccount/Buttons.jsx"; // 기존 Buttons 재사용
import { getStorage, setStorage } from "@utils/storage.js";

const Login = () => {
  const navigate = useNavigate();
  
 
  const [loginForm, setLoginForm] = useState({
    email: "",
    pwd: "",
    inputs: [],
    btns: []
  });

  // 2. 공통 입력 핸들러
  const handleChange = (key, value) => {
    setLoginForm(prev => ({ ...prev, [key]: value }));
  };

  // 3. 로그인 버튼 클릭 시 실행될 로직
  const onLogin = (e) => {
    if (e) e.preventDefault();

    // 회원가입 시 저장했던 전체 리스트 불러오기
    const userList = getStorage("list") || [];
    
    // 입력한 정보와 일치하는 사용자 찾기
    const user = userList.find(u => u.email === loginForm.email && u.pwd === loginForm.pwd);

    if (user) {
      alert(`${user.name}님, 환영합니다!`);
      // 현재 로그인한 사용자의 정보를 따로 저장 (세션 역할)
      setStorage("loginUser", user);
      navigate("/mypage"); // 마이페이지로 이동
    } else {
      alert("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  useEffect(() => {
    // 4. 로그인용 입력 필드 구성
    const arr1 = [
      { id: "email", name: "이메일", type: "email", placeholder: "이메일을 입력하세요.", value: loginForm.email, onChange: (val) => handleChange("email", val) },
      { id: "pwd", name: "비밀번호", type: "password", placeholder: "비밀번호를 입력하세요.", value: loginForm.pwd, onChange: (val) => handleChange("pwd", val) },
    ];
    
    // 5. 로그인용 버튼 구성
    const arr2 = [
      { type: "submit", txt: "로그인", onclick: null }, // form의 onSubmit으로 처리됨
      { type: "button", txt: "회원가입", onclick: () => navigate("/") },
    ];

    setLoginForm(prev => ({ ...prev, inputs: arr1, btns: arr2 }));
  }, [loginForm.email, loginForm.pwd]);

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="p-5 shadow bg-white" style={{ width: "400px", borderRadius: "15px", borderTop: "8px solid #1e293b" }}>
        <h2 className="text-center mb-4 fw-bold" style={{ color: "#1e293b" }}>LOGIN</h2>
        
        <form onSubmit={onLogin}>
          {/* 이미 만들어둔 컴포넌트들 재사용 */}
          <Inputs inputs={loginForm.inputs} />
          <div className="mt-4">
            <Buttons btns={loginForm.btns} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;