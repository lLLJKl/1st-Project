import { useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import KpiCard from "@/components/KpiCard";
import ProjectList from "@/components/ProjectList";
import AddProjectButton from "@/components/AddProjectButton";

import { Tabs, Tab } from "react-bootstrap";


const Home = () => {
  // 🔹 단일 데이터 소스
  const [projects, setProjects] = useState([
  { id: 1, name: "공장 에너지 효율 개선", reduction: 1200, status: "ongoing" },
  { id: 2, name: "태양광 설비 도입", reduction: 2300, status: "completed" }
]);
  const [activeTab, setActiveTab] = useState("ongoing");
  const filteredProjects = projects.filter(
  p => p.status === activeTab
);


  // 🔹 프로젝트 추가 로직
  const addProject = () => {
    setProjects(prev => [
      ...prev,
      {
        id: Date.now(),
        name: `신규 프로젝트 ${prev.length + 1}`,
        reduction: Math.floor(Math.random() * 1000) + 500
      }
    ]);
  };

  // 🔹 KPI 계산
  const totalReduction = projects.reduce(
    (sum, p) => sum + p.reduction, 0
  );
  const progressRate = Math.min(
    Math.round((totalReduction / 10000) * 100), 100
  );

  return (
    <>
      <h4 className="mb-4">홍길동님, 안녕하세요!</h4>

      {/* KPI 영역 */}
      <Row className="mb-4">
        <Col>
          <KpiCard title="탄소 감축 목표" value={`${progressRate}%`} sub="2030 목표 대비" />
        </Col>
        <Col>
          <KpiCard title="ESG 프로젝트" value={`${projects.length}건`} sub="진행중" />
        </Col>
        <Col>
          <KpiCard title="이행률" value={`${progressRate}%`} sub="양호" />
        </Col>
        <Col>
          <KpiCard title="탄소 감소량" value={`${totalReduction.toLocaleString()} tCO₂`} sub="누적 감축량" />
        </Col>
      </Row>

      {/* 프로젝트 목록 */}
      <Row>
        <Col md={7}>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-bold mb-0">프로젝트 목록</h6>
                <AddProjectButton onClick={addProject} />
              </div>

              {/* 🔹 탭 영역 */}
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3"
              >
                <Tab eventKey="ongoing" title="진행중">
                  <ProjectList projects={filteredProjects} />
                </Tab>

                <Tab eventKey="completed" title="완료">
                  <ProjectList projects={filteredProjects} />
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>

        {/* KPI 상세 */}
        <Col md={5}>
          <Card>
            <Card.Body>
              <h6 className="fw-bold">탄소 감축 KPI</h6>
              <h4 className="fw-bold mt-3">
                {totalReduction.toLocaleString()} tCO₂
              </h4>
              <small className="text-muted">BAU 기준</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Home;
