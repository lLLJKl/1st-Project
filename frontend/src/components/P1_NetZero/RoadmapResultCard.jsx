import { Badge, Card, Table } from "react-bootstrap";

const formatNumber = (n) => {
  if (n == null || Number.isNaN(Number(n))) return "-";
  return Math.round(Number(n)).toLocaleString("ko-KR");
};

const RoadmapResultCard = ({ method, rows }) => {
  const last = rows?.[rows.length - 1];

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title className="fw-bold mb-1">결과</Card.Title>

        {/* 요약 */}
        {last && (
          <div className="d-flex flex-wrap gap-3 mb-3">
            <div>
              <div className="small text-muted">마지막 연도</div>
              <div className="fw-semibold">{last.year}</div>
            </div>
            <div>
              <div className="small text-muted">BAU</div>
              <div className="fw-semibold">{formatNumber(last.bau_emissions)} tCO₂e</div>
            </div>
            {method === "ACA" && (
              <div>
                <div className="small text-muted">Goal</div>
                <div className="fw-semibold">{formatNumber(last.goal_emissions)} tCO₂e</div>
              </div>
            )}
            <div>
              <div className="small text-muted">Net</div>
              <div className="fw-semibold">{formatNumber(last.net_emissions)} tCO₂e</div>
            </div>
          </div>
        )}

        {/* TODO: 차트 컴포넌트 추가 (Recharts/Chart.js 등) */}

        <Table responsive bordered size="sm" className="mb-0">
          <thead>
            <tr className="table-light">
              <th style={{ width: 100 }}>연도</th>
              <th>BAU</th>
              {method === "ACA" && <th>목표(Goal)</th>}
              <th>순배출(Net)</th>
              <th style={{ width: 160 }}>경고</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.year}>
                <td>{r.year}</td>
                <td>{formatNumber(r.bau_emissions)}</td>
                {method === "ACA" && <td>{formatNumber(r.goal_emissions)}</td>}
                <td>{formatNumber(r.net_emissions)}</td>
                <td>
                  {r.warnings?.length ? (
                    r.warnings.map((w) => (
                      <Badge bg="warning" text="dark" className="me-1" key={w}>
                        {w}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted small">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default RoadmapResultCard;
