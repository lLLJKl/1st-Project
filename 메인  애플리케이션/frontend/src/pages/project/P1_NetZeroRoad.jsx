import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";

import BaseInventoryCard from "@/components/P1_NetZero/BaseInventoryCard";
import ScenarioSelectorCard from "@/components/P1_NetZero/ScenarioSelectorCard";
import SbtiTargetCard from "@/components/P1_NetZero/SbtiTargetCard";
import BauAssumptionCard from "@/components/P1_NetZero/BauAssumptionCard";
import MeasuresCard from "@/components/P1_NetZero/MeasuresCard";
import RoadmapDashboard from "@/components/P1_NetZero/RoadmapDashboard";

async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      msg = data?.detail || data?.message || msg;
    } catch (_) {}
    throw new Error(msg);
  }
  if (res.status === 204) return null;
  return res.json();
}

const P1_NetZeroRoad = () => {
  const { projectId } = useParams();
  const apiBase = "/api";

  // 입력 상태 (프론트는 입력/표시만. 연산은 백엔드)
  const [baseYear, setBaseYear] = useState(2021);
  const [scope1, setScope1] = useState(1000000);
  const [scope2, setScope2] = useState(1705383);
  const [scope3, setScope3] = useState(0); // MVP: 선택적으로 확장

  // ✅ 목표 설정 방식: Forecasting / Backcasting
  const [goalMethod, setGoalMethod] = useState("BACKCASTING");

  // Backcasting에서만 타겟 입력(SBTi 등)
  const [sbtiEnabled, setSbtiEnabled] = useState(true);
  const [nearTargetYear, setNearTargetYear] = useState(2030);
  const [nearReductionPct, setNearReductionPct] = useState(45);
  const [netZeroYear, setNetZeroYear] = useState(2050);

  // BAU 전망(공통 baseline)
  const [bauGrowthRate, setBauGrowthRate] = useState(1);

  // ✅ scenarioId: measures를 엮기 위한 키(임시로 projectId 사용 가능)
  const [scenarioId, setScenarioId] = useState(null);

  // 결과 상태(차트용 rows)
  const [rows, setRows] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // MVP: 우선 scenarioId를 projectId로 둠
    // 정식: 백엔드에서 P1_netzero 시나리오 생성/조회 API로 scenarioId 확보
    setScenarioId(projectId);
  }, [projectId]);

  const runPreview = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        base_year: Number(baseYear),
        inventory: {
          scope1_tco2e: Number(scope1) || 0,
          scope2_tco2e: Number(scope2) || 0,
          scope3_tco2e: Number(scope3) || 0,
        },
        bau: { growth_rate_pct: Number(bauGrowthRate) || 0 },
        goal_method: goalMethod,
        sbti:
          goalMethod === "BACKCASTING"
            ? {
                enabled: !!sbtiEnabled,
                near_target_year: Number(nearTargetYear),
                near_reduction_pct: Number(nearReductionPct),
                net_zero_year: Number(netZeroYear),
              }
            : { enabled: false, near_target_year: null, near_reduction_pct: null, net_zero_year: Number(netZeroYear) },
        scenario_id: scenarioId,
      };

      const data = await apiFetch(`${apiBase}/projects/${encodeURIComponent(projectId)}/netzero/preview`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const outRows = Array.isArray(data) ? data : data?.rows || [];
      setRows(outRows);

      const lastYear = outRows?.[outRows.length - 1]?.year ?? null;
      setSelectedYear(lastYear);

      if (data?.scenario_id) setScenarioId(data.scenario_id);
    } catch (e) {
      setError(e.message || "계산 실패");
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setBaseYear(2021);
    setScope1(1000000);
    setScope2(1705383);
    setScope3(0);
    setGoalMethod("BACKCASTING");
    setSbtiEnabled(true);
    setNearTargetYear(2030);
    setNearReductionPct(45);
    setNetZeroYear(2050);
    setBauGrowthRate(1);
    setRows([]);
    setSelectedYear(null);
    setError(null);
  };

  // ✅ 스크롤 과다 해결: 좌측 입력 패널은 sticky + 내부 스크롤
  const leftPanelStyle = {
    position: "sticky",
    top: 16,
    maxHeight: "calc(100vh - 32px)",
    overflowY: "auto",
    paddingRight: 4,
  };

  const minMeasureYear = Number(baseYear) + 1;
  const maxMeasureYear = Number(netZeroYear);

  return (
    <Container fluid className="py-4 px-4">
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

      {error && (
        <Alert variant="danger" className="py-2">
          <div className="small mb-0">{error}</div>
        </Alert>
      )}

      <Row className="g-3">
        {/* 좌측 입력 */}
        <Col lg={4} xl={3}>
          <div style={leftPanelStyle}>
            <BaseInventoryCard
              baseYear={baseYear}
              setBaseYear={setBaseYear}
              scope1={scope1}
              setScope1={setScope1}
              scope2={scope2}
              setScope2={setScope2}
              scope3={scope3}
              setScope3={setScope3}
            />

            <div className="mt-3">
              <ScenarioSelectorCard goalMethod={goalMethod} setGoalMethod={setGoalMethod} />
            </div>

            <div className="mt-3">
              <BauAssumptionCard bauGrowthRate={bauGrowthRate} setBauGrowthRate={setBauGrowthRate} />
            </div>

            {goalMethod === "BACKCASTING" && (
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

            <div className="mt-3">
              <MeasuresCard
                projectId={projectId}
                scenarioId={scenarioId}
                apiBase={apiBase}
                minStartYear={minMeasureYear}
                maxStartYear={maxMeasureYear}
                onChanged={() => {
                  // 감축활동이 변경되면 결과 재조회(프론트 연산 금지)
                  if (rows?.length) runPreview();
                }}
              />
            </div>

            <div className="d-grid mt-3">
              <Button variant="primary" className="fw-semibold" onClick={runPreview} disabled={loading}>
                {loading ? "계산 중…" : "계산 실행하기"}
              </Button>
            </div>
          </div>
        </Col>

        {/* 우측 결과 (향후 분석 카드 확장 영역) */}
        <Col lg={8} xl={9}>
          <RoadmapDashboard rows={rows} selectedYear={selectedYear} setSelectedYear={setSelectedYear} />

          <Row className="g-3 mt-1">
            <Col md={6} xl={4}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title className="fw-bold mb-1">요약(Placeholder)</Card.Title>
                  <div className="text-muted small">
                    그래프 아래에 향후 KPI/갭 분석/시나리오 비교 결과를 추가할 예정입니다.
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} xl={4}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title className="fw-bold mb-1">갭 분석(Placeholder)</Card.Title>
                  <div className="text-muted small">Backcasting 시 목표 대비 부족 감축량 등을 표시할 영역</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={12} xl={4}>
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title className="fw-bold mb-1">활동 목록 요약(Placeholder)</Card.Title>
                  <div className="text-muted small">CONFIRMED/ACTIVE/IDEA 분포, 연간 총감축량 등</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default P1_NetZeroRoad;
