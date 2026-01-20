import { Card, Form } from "react-bootstrap";

const BauAssumptionCard = ({ bauGrowthRate, setBauGrowthRate }) => {
  return (
    <Card className="shadow-sm h-100">
      <Card.Body>
        <Card.Title className="fw-bold mb-1">BAU 가정</Card.Title>
        <div className="text-muted small mb-3">
          BAU 가정은 결과에 큰 영향을 미칩니다.
        </div>

        <Form.Label className="small text-muted">연평균 성장률 g (%)</Form.Label>
        <Form.Control
          type="number"
          step="0.1"
          value={bauGrowthRate}
          onChange={(e) => setBauGrowthRate(Number(e.target.value))}
        />

        <div className="text-muted small mt-2">
          디폴트는 1%입니다. (🔴 실제 기업 상황에 맞게 반드시 검토)
        </div>

        {/* TODO: 효율개선률 e, 생산량/매출 기반 BAU(확장) */}
      </Card.Body>
    </Card>
  );
};

export default BauAssumptionCard;
