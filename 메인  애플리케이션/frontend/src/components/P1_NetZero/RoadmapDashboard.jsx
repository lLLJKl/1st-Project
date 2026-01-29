import { Card, Form } from "react-bootstrap";
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
} from "recharts";

const fmt = (n) => (n == null ? "-" : Math.round(n).toLocaleString("ko-KR"));

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const row = payload[0]?.payload;
  return (
    <div className="bg-white border rounded p-2" style={{ minWidth: 220 }}>
      <div className="fw-bold mb-1">{label}년</div>
      <div className="small">Goal Scope1: {fmt(row.goal_s1)} tCO₂e</div>
      <div className="small">Goal Scope2: {fmt(row.goal_s2)} tCO₂e</div>
      <div className="small">Goal Scope3: {fmt(row.goal_s3)} tCO₂e</div>
      <div className="small fw-semibold mt-1">Goal 합계: {fmt(row.goal_total)} tCO₂e</div>
      <hr className="my-2" />
      <div className="small fw-semibold">실제/예상(BAU): {fmt(row.bau_total)} tCO₂e</div>
    </div>
  );
}

const RoadmapDashboard = ({ rows, selectedYear, setSelectedYear }) => {
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
            <div className="text-muted small">
              막대=목표(Goal, Scope별) / 선=실제·예상 배출량(BAU)
            </div>
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

        {/* 차트 */}
        <div style={{ width: "100%", height: 380 }}>
          <ResponsiveContainer>
            <ComposedChart data={rows} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(v) => fmt(v)} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {/* 막대(목표): Scope1/2/3 스택 */}
              <Bar dataKey="goal_s1" stackId="goal" name="목표 Scope1" />
              <Bar dataKey="goal_s2" stackId="goal" name="목표 Scope2" />
              <Bar dataKey="goal_s3" stackId="goal" name="목표 Scope3(예비)" />

              {/* 선(실제/예상): BAU 총배출 */}
              <Line type="monotone" dataKey="bau_total" name="실제/예상 배출량(BAU)" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* 선택 연도 요약 */}
        <div className="mt-3 d-flex gap-4 flex-wrap">
          <div>
            <div className="small text-muted">선택 연도</div>
            <div className="fw-semibold">{current?.year ?? "-"}</div>
          </div>
          <div>
            <div className="small text-muted">Goal 합계</div>
            <div className="fw-semibold">{fmt(current?.goal_total)} tCO₂e</div>
          </div>
          <div>
            <div className="small text-muted">실제/예상(BAU)</div>
            <div className="fw-semibold">{fmt(current?.bau_total)} tCO₂e</div>
          </div>
        </div>

        {/* TODO: 표는 기존 표 컴포넌트 유지하거나, 아래에 스크롤 테이블로 재배치 */}
      </Card.Body>
    </Card>
  );
};

export default RoadmapDashboard;
