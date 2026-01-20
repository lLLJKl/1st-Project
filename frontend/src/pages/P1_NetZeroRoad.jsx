import { useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";

import BaseInventoryCard from "@components/P1_NetZero/BaseInventoryCard";
import ScenarioSelectorCard from "@components/P1_NetZero/ScenarioSelectorCard";
import SbtiTargetCard from "@components/P1_NetZero/SbtiTargetCard";
import BauAssumptionCard from "@components/P1_NetZero/BauAssumptionCard";
import RoadmapDashboard from "@components/P1_NetZero/RoadmapDashboard";

const P1_NetZeroRoad = () => {
  const { projectId } = useParams();

  // ===== 입력 상태 (너가 이미 쓰던 상태 그대로) =====
  const [baseYear, setBaseYear] = useState(2019);
  const [scope1, setScope1] = useState(1000000);
  const [scope2, setScope2] = useState(1705383);
  const baseEmissions = (Number(scope1) || 0) + (Number(scope2) || 0);

  const [method, setMethod] = useState("ACA");
  const [sbtiEnabled, setSbtiEnabled] = useState(false);
  const [nearTargetYear, setNearTargetYear] = useState(2030);
  const [nearReductionPct, setNearReductionPct] = useState(45);
  const [netZeroYear, setNetZeroYear] = useState(2050);
  const [bauGrowthRate, setBauGrowthRate] = useState(1);

  // ===== 결과 상태 =====
  const [rows, setRows] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);

  const computeRoadmap = () => {
    // TODO: 네가 이미 만든 mock 계산 로직을 여기 그대로 붙이면 됨.
    // 지금은 예시로 최소 구조만.
    const start = baseYear;
    const end = netZeroYear;
    const g = (Number(bauGrowthRate) || 0) / 100;

    const tmp = [];
    for (let y = start; y <= end; y++) {
      const t = y - start;
      const bau = baseEmissions * Math.pow(1 + g, t);

      // goal은 임시(ACA일 때만), sbtiEnabled면 piecewise로 교체 가능
      const goal = method === "ACA" ? baseEmissions * (1 - t / (end - start)) : null;

      tmp.push({
        year: y,
        bau_emissions: bau,
        goal_emissions: goal,
        net_emissions: bau, // MVP: 아직 감축/상쇄 미적용
      });
    }

    setRows(tmp);
    setSelectedYear(end);
  };

  const resetAll = () => {
    setBaseYear(2019);
    setScope1(1000000);
    setScope2(1705383);
    setMethod("ACA");
    setSbtiEnabled(false);
    setNearTargetYear(2030);
    setNearReductionPct(45);
    setNetZeroYear(2050);
    setBauGrowthRate(1);
    setRows([]);
    setSelectedYear(null);
  };

  return (
    <Container fluid className="py-4 px-4">
      {/* 헤더 */}
      <Row className="align-items-center mb-3">
        <Col>
          <h4 className="fw-bold mb-1">{`프로젝트 #${projectId}`}</h4>
          <div className="text-muted small">탄소중립 로드맵 설정</div>
        </Col>
        <Col xs="auto" className="d-flex gap-2">
          <Button variant="outline-secondary" size="sm" disabled>
            저장
          </Button>
          <Button variant="outline-danger" size="sm" onClick={resetAll}>
            초기화
          </Button>
        </Col>
      </Row>

      {/* ✅ 핵심: 좌 입력 / 우 대시보드 */}
      <Row className="g-3">
        {/* 좌측 입력 패널 */}
        <Col lg={4} xl={3}>
          <div style={{ position: "sticky", top: 16 }}>
            <BaseInventoryCard
              baseYear={baseYear}
              setBaseYear={setBaseYear}
              scope1={scope1}
              setScope1={setScope1}
              scope2={scope2}
              setScope2={setScope2}
              baseEmissions={baseEmissions}
            />

            <div className="mt-3">
              <ScenarioSelectorCard method={method} setMethod={setMethod} />
            </div>

            <div className="mt-3">
              <BauAssumptionCard
                bauGrowthRate={bauGrowthRate}
                setBauGrowthRate={setBauGrowthRate}
              />
            </div>

            {method === "ACA" && (
              <div className="mt-3">
                <SbtiTargetCard
                  sbtiEnabled={sbtiEnabled}
                  setSbtiEnabled={setSbtiEnabled}
                  nearTargetYear={nearTargetYear}
                  setNearTargetYear={setNearTargetYear}
                  nearReductionPct={nearReductionPct}
                  setNearReductionPct={setNearReductionPct}
                  netZeroYear={netZeroYear}
                  setNetZeroYear={setNetZeroYear}
                />
              </div>
            )}

            <div className="d-grid mt-3">
              <Button variant="primary" className="fw-semibold" onClick={computeRoadmap}>
                계산 실행하기
              </Button>
            </div>
          </div>
        </Col>

        {/* 우측 대시보드 */}
        <Col lg={8} xl={9}>
          <RoadmapDashboard
            rows={rows}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default P1_NetZeroRoad;
