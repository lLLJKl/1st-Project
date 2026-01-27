import { Card, Col, Form, Row } from "react-bootstrap";

const BaseInventoryCard = ({
  baseYear,
  setBaseYear,
  scope1,
  setScope1,
  scope2,
  setScope2,
  scope3,
  setScope3,
}) => {
  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title className="fw-bold mb-1">기준연도 배출량</Card.Title>
        <div className="text-muted small mb-3">
        </div>

        {/* 1행: 기준연도 */}
        <Row className="g-3">
          <Col>
            <Form.Label className="small text-muted">기준연도</Form.Label>
            <Form.Control
              type="number"
              value={baseYear}
              onChange={(e) => setBaseYear(Number(e.target.value))}
            />
          </Col>
        </Row>

        {/* 2행: Scope1/2/3 */}
        <Row className="g-3 mt-1">
          <Col md={4}>
            <Form.Label className="small text-muted">Scope1 (tCO₂e)</Form.Label>
            <Form.Control
              type="number"
              value={scope1}
              onChange={(e) => setScope1(Number(e.target.value))}
              min={0}
            />
          </Col>

          <Col md={4}>
            <Form.Label className="small text-muted">Scope2 (tCO₂e)</Form.Label>
            <Form.Control
              type="number"
              value={scope2}
              onChange={(e) => setScope2(Number(e.target.value))}
              min={0}
            />
          </Col>

          <Col md={4}>
            <Form.Label className="small text-muted">Scope3 (tCO₂e)</Form.Label>
            <Form.Control
              type="number"
              value={scope3}
              onChange={(e) => setScope3(Number(e.target.value))}
              min={0}
              placeholder="(향후 연동 예정)"
            />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default BaseInventoryCard;
