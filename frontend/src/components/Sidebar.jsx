import { useState } from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

//사이드바 완료 app.jsx수정요망

const Sidebar = () => {
  const [dataOpen, setDataOpen] = useState(false);

  return (
    <div
      className="sidebar d-flex flex-column p-3"
      style={{ height: "100vh" }}   // ⭐ 중요: 전체 높이 확보
    >
      <h5 className="fw-bold mb-4">🌿 ESG 플랫폼</h5>

      {/* 상단 메뉴 */}
      <Nav className="flex-column gap-1">
        <Nav.Link as={NavLink} to="/" end>
          📊 대시보드
        </Nav.Link>

        <Nav.Link as={NavLink} to="/projects">
          📁 프로젝트
        </Nav.Link>

        {/* 데이터셋 (토글) */}
        <Nav.Link
          onClick={() => setDataOpen(!dataOpen)}
          style={{ cursor: "pointer" }}
        >
          📈 데이터셋 {dataOpen ? "▲" : "▼"}
        </Nav.Link>

        {dataOpen && (
          <div className="ms-3">
            <Nav.Link as={NavLink} to="/data/energy" className="text-secondary">
              └ 에너지 데이터
            </Nav.Link>
            <Nav.Link as={NavLink} to="/data/emission" className="text-secondary">
              └ 배출량 데이터
            </Nav.Link>
            <Nav.Link as={NavLink} to="/data/cost" className="text-secondary">
              └ 비용 데이터
            </Nav.Link>
          </div>
        )}

        <Nav.Link as={NavLink} to="/reports">
          📄 리포트
        </Nav.Link>

        {/* 프로젝트 추가 */}
        <Nav.Link
          as={NavLink}
          to="/projects/new"
          className="fw-semibold mt-3"
        >
          ➕ 프로젝트 추가
        </Nav.Link>
      </Nav>

      {/* 하단 고정 영역 */}
      <div className="mt-auto">
        <Nav.Link as={NavLink} to ="/mypage" className="text-muted">
          ⚙ 설정
        </Nav.Link>
      </div>
    </div>
  );
};

export default Sidebar;
