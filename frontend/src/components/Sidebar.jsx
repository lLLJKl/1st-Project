import { useState } from "react";
import { Nav, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { List } from "react-bootstrap-icons";
import { BoxArrowRight } from "react-bootstrap-icons";
import { Gear } from "react-bootstrap-icons";


//사이드바 완료 app.jsx수정요망

const Sidebar = () => {
  const [dataOpen, setDataOpen] = useState(false);
  const [isCollapsed, setisCollapsed] = useState(false);

  const sidebarWidth = isCollapsed ? "80px" : "250px";
   const handleLogout = () => {
    if (window.confirm("로그아웃 하시겠습니까?")) {
      navigate("/signin");
    }
  };
  return(
    <div
    className="sidebar d-flex flex-column p-3 bg-light"
    style={{
      height: "100vh", 
        width: sidebarWidth, 
        transition: "width 0.2s", // 부드러운 애니메이션
        overflowX: "hidden",      // 접혔을 때 글자 숨김
        whiteSpace: "nowrap",     // 줄바꿈 방지
        borderRight: "1px solid #ddd",
        position: "sticky",
        top : 0,
        left:0,
        zIndex: 1000

     }}
    >
    <Button
      variant="light"
      onClick={() => setisCollapsed(!isCollapsed)}
      className="mb-3 p-1 shadow-none"
      style={{ width: "fit-content"}}    
    >
       <List size={24} />
    </Button>  

     
      <Nav.Link as={NavLink} to="/" className="fs-4 fw-bold mb-4 text-dark"
      style={{ textDecoration: 'none'}}>
       
      🌿 {!isCollapsed && "ESG 플랫폼"}
      </Nav.Link>
      
      
      {/* 상단 메뉴 */}
      
        <Nav className="flex-column">
        <Nav.Link
          onClick={() => {
          if(isCollapsed) setisCollapsed(false); // 접혀있을 때 누르면 펴지게
          setDataOpen(!dataOpen);
          }}
          style={{ cursor: "pointer" }}
          className="text-dark fw-bold px-0" 
          >
            
          📁 {!isCollapsed && `프로젝트 ${dataOpen ? "▲" : "▼"}`}
        </Nav.Link>
      
          

        {/* 데이터셋 (토글) */}
        {!isCollapsed && dataOpen && (
      <div className="ms-3">      
        <div className="mt-2 fw-semibold text-muted small">  📈 데이터셋 </div>
        <Nav.Link as={NavLink} to="/data/energy" className="text-secondary py-1">└ 에너지 데이터</Nav.Link>
        <Nav.Link as={NavLink} to="/data/emission" className="text-secondary py-1">└ 배출량 데이터</Nav.Link>
        <Nav.Link as={NavLink} to="/data/cost" className="text-secondary py-1">└ 비용 데이터</Nav.Link>

       
        <div className="mt-2 fw-semibold text-muted small">📄 리포트 </div>
            <Nav.Link as={NavLink} to="/data/1st" className="text-secondary">└ 1번리포트</Nav.Link>
            <Nav.Link as={NavLink} to="/data/2nd" className="text-secondary">└ 2번리포트</Nav.Link>
            <Nav.Link as={NavLink} to="/data/3rd" className="text-secondary">└ 3번리포트</Nav.Link>
          </div> 
         )}

   
   
        {/* 프로젝트 추가 */}
        <Nav.Link
          as={NavLink}
          to="/projects/new"
          className="fw-semibold mt-3 text-primary"
        >
          ➕ {!isCollapsed && "프로젝트 추가" }
          </Nav.Link>
        </Nav>
      

      {/* 하단 고정 영역 */}
      <div className="mt-auto">
        <hr />
        <Nav.Link as={NavLink} to ="/mypage" className="text-dark px-0 d-flex align-items-center gap-2 py-1">
        < Gear size ={20} color= "dark" />
           {!isCollapsed && "설정"}
        </Nav.Link>
        <Nav.Link 
          onClick={handleLogout} 
          className="text-dark px-0 d-flex align-items-center gap-2 py-1" 
          style={{ cursor: 'pointer' }}
        >
          <BoxArrowRight size={20} color="#000000" />
          {!isCollapsed && "로그아웃"}
        </Nav.Link>
      </div>
    </div>    
  );
};

export default Sidebar;
