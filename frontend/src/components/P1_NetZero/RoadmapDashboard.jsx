import { Card, Form, Table } from "react-bootstrap";

const format = (n) => (n == null ? "-" : Math.round(n).toLocaleString("ko-KR"));

const RoadmapDashboard = ({ rows, selectedYear, setSelectedYear }) => {
  // rows: [{year, bau_emissions, goal_emissions, net_emissions ...}]
  const years = rows?.map((r) => r.year) ?? [];
  const lastYear = years[years.length - 1];
  const currentYear = selectedYear ?? lastYear;

  const current = rows?.find((r) => r.year === Number(currentYear));

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <Card.Title className="fw-bold mb-1">탄소중립 로드맵</Card.Title>
            <div className="text-muted small">막대 차트 영역 (TODO: 차트 라이브러리 연결)</div>
          </div>

          <div style={{ width: 140 }}>
            <Form.Select
              value={currentYear ?? ""}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              disabled={!rows?.length}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </Form.Select>
          </div>
        </div>

        {/* ✅ 차트 자리(지금은 박스만) */}
        <div
          className="border rounded bg-light"
          style={{ height: 360, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <div className="text-muted">
            Bar Chart Placeholder
            <div className="small mt-1">TODO: Recharts/Chart.js로 스택 막대 차트 구현</div>
          </div>
        </div>

        {/* ✅ 선택 연도 요약 */}
        <div className="mt-3 d-flex gap-4 flex-wrap">
          <div>
            <div className="small text-muted">선택 연도</div>
            <div className="fw-semibold">{current?.year ?? "-"}</div>
          </div>
          <div>
            <div className="small text-muted">BAU</div>
            <div className="fw-semibold">{format(current?.bau_emissions)} tCO₂e</div>
          </div>
          <div>
            <div className="small text-muted">Goal</div>
            <div className="fw-semibold">{format(current?.goal_emissions)} tCO₂e</div>
          </div>
          <div>
            <div className="small text-muted">Net</div>
            <div className="fw-semibold">{format(current?.net_emissions)} tCO₂e</div>
          </div>
        </div>

        {/* ✅ 하단 간단 표(차트 전 단계에서 유용) */}
        <div className="mt-3">
          <Table responsive bordered size="sm" className="mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: 90 }}>연도</th>
                <th>BAU</th>
                <th>Goal</th>
                <th>Net</th>
              </tr>
            </thead>
            <tbody>
              {(rows ?? []).slice(0, 12).map((r) => (
                <tr key={r.year}>
                  <td>{r.year}</td>
                  <td>{format(r.bau_emissions)}</td>
                  <td>{format(r.goal_emissions)}</td>
                  <td>{format(r.net_emissions)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="text-muted small mt-2">
            (MVP) 표는 일부 연도만 표시. TODO: pagination 또는 스크롤
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default RoadmapDashboard;
