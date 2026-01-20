import { useNavigate } from "react-router";
import { useState, useEffect} from "react";
import Inputs from "@components/createAccount/Inputs.jsx";
import Radio from "@components/createAccount/Radio.jsx";
import Buttons from "@components/createAccount/Buttons.jsx";
import { getStorage, setStorage, getDate } from "@utils/storage.js";


const CreateAccount = () =>{
    const navigate = useNavigate();

    //상태 관리
    const[user, setUser] = useState({
        email: "",
        pwd: "",
        name: "",
        userType: "employee",
        createdAt: "", // 가입일
        updatedAt: "", // 수정일
        inputs: [],
        btns: [],
        list: []
    });

    const handleChange = (key, value) =>{
        setUser(prev =>({...prev,[key]: value}));
    };

    const close = () =>navigate("/")

    const onSubmit = (e) => {
        e.preventDefault();
        const now = getDate(); 
        
    // 가입일(regDate), 수정일(updateDate) 추가
        const data = { 
        name: user.name, email: user.email, pwd: user.pwd, 
        userType: user.userType, regDate: now, updateDate: now 
    };

    setStorage("list", [...user.list, data]);
    close();
    };

    useEffect(() => {
    // Inputs 설정 (onChange에 공통 핸들러 연결)
    const arr1 = [
      { id: "email", name: "이메일", type: "email", placeholder: "ID로 사용할 이메일 입력", value: user.email, onChange: (val) => handleChange("email", val) },
      { id: "pwd", name: "비밀번호", type: "password", placeholder: "비밀번호 입력", value: user.pwd, onChange: (val) => handleChange("pwd", val) },
      { id: "name", name: "이름", type: "text", placeholder: "성함 입력", value: user.name, onChange: (val) => handleChange("name", val) },
    ];

    const arr2 = [
      { type: "submit", txt: "회원가입", onclick: null },
      { type: "button", txt: "취소", onclick: close },
    ];

    const storedList = getStorage("list") || [];
    
    // 상태 업데이트 (inputs, btns, list를 한 번에)
    setUser(prev => ({ ...prev, inputs: arr1, btns: arr2, list: storedList }));
  }, [user.name, user.email, user.pwd, user.userType]); // 입력값 변경 시 UI 동기화

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="text-center mb-4 fw-bold" style={{ color: "#1e293b" }}>회원가입</h2>
      <div className="shadow p-4 bg-white" style={{ borderRadius: "15px", borderTop: "5px solid #1e293b" }}>
        <form onSubmit={onSubmit}>
          <Inputs inputs={user.inputs} />
          <div className="mb-4">
            <label className="form-label fw-bold" style={{ color: "#1e293b" }}>회원 유형</label>
            <Radio 
              userType={user.userType} 
              onChange={(val) => handleChange("userType", val)} 
            />
          </div>
          <Buttons btns={user.btns} />
        </form>
      </div>
    </div>
  );
};

export default CreateAccount