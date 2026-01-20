import { Nav, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar d-flex flex-column p-3">
        <h5 className="fw-bold mb-4">🌿 ESG 플랫폼</h5>

      <Nav className="flex-column gap-1 mb-3">
        <Nav.Link as={NavLink} to="/" end>📊 대시보드</Nav.Link>
        <Nav.Link as={NavLink} to="/projects">📁 프로젝트</Nav.Link>
        <Nav.Link as={NavLink} to="/data">📈 데이터셋</Nav.Link>
        <Nav.Link as={NavLink} to="/reports">📄 리포트</Nav.Link>
        <Nav.Link as={NavLink} to="/admin">⚙ 관리</Nav.Link>
      </Nav>

      {/* 하단 고정 영역 */}
      <div className="mt-auto">
        <Button onClick={() => navigate("/projects/new")}
          variant="primary"
          className="w-100 rounded-pill fw-semibold"
        >
          + 프로젝트 추가
        </Button>

        <Nav.Link className="text-muted mt-3">⚙ 설정</Nav.Link>
      </div>
    </div>
  );
};

export default Sidebar;
