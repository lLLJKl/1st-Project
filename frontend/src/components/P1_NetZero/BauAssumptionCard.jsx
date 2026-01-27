import { Accordion, Form } from "react-bootstrap";

const BauAssumptionCard = ({ bauGrowthRate, setBauGrowthRate }) => {
  return (
    <Accordion defaultActiveKey={null} className="shadow-sm rounded">
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <div>
            <div className="fw-bold">BAU 가정</div>
            <div className="text-muted small">
              현재: 연평균 성장률 g = {Number(bauGrowthRate || 0).toFixed(1)}%
            </div>
          </div>
        </Accordion.Header>

        <Accordion.Body>
          <div className="text-muted small mb-2">
            BAU 가정은 결과에 큰 영향을 미칩니다. 디폴트는 1%이며 🔴 반드시 검토하세요.
          </div>

          <Form.Label className="small text-muted">연평균 성장률 g (%)</Form.Label>
          <Form.Control
            type="number"
            step="0.1"
            value={bauGrowthRate}
            onChange={(e) => setBauGrowthRate(Number(e.target.value))}
            min={-100}
          />

          {/* TODO: 확장 - 효율개선률, 활동지표 기반 BAU */}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default BauAssumptionCard;
