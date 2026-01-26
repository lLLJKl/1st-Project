import { Dropdown, Form, FormControl, Badge } from "react-bootstrap";
import { Bell } from "react-bootstrap-icons"; 
import { useNavigate } from "react-router-dom";


const Topbar = () => {
  const navigate = useNavigate();
  
  return (
    <div className="topbar d-flex align-items-center px-4 border-bottom bg-white" 
    style={{ 
      height: "64px", 
      position: "sticky",
      top:0,
      zIndex: 999,
      width: "100%"
    }}>
     
      

      <div className="ms-auto d-flex align-items-center gap-2">
        
        
        
            홍길동
          

        
        <img
          src="https://via.placeholder.com/32" 
          alt="user-avatar"
          className="rounded-circle border me-3"
          style={{ width: "34px", height: "34px", objectFit: "cover", cursor: "pointer" }}
          onClick={() => navigate("/profile")}
        />

        
        <Dropdown align="end">
          <Dropdown.Toggle variant="link" className="text-dark p-0 position-relative text-decoration-none shadow-none border-0">
            <Bell size={22} />
           <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle p-1" style={{ fontSize: '0.6rem' }}>
              2
            </Badge>
          </Dropdown.Toggle>

          <Dropdown.Menu className="shadow border-0 mt-2" style={{ width: "350px" }}>
            <Dropdown.Header className="fw-bold">최근 알림</Dropdown.Header> 
            <Dropdown.Item>탄소 배출량이 목표치를 초과했습니다.</Dropdown.Item> 
            <Dropdown.Item>새로운 월간 리포트가 생성되었습니다.</Dropdown.Item>
            <Dropdown.Divider /> 
            <Dropdown.Item className="text-center small text-primary">모든 알림 보기</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

      </div>
    </div>
  );
};

export default Topbar;