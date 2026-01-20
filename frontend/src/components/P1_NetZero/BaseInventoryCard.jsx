import { Card, Col, Form, Row } from "react-bootstrap";

const BaseInventoryCard = ({
  baseYear,
  setBaseYear,
  scope1,
  setScope1,
  scope2,
  setScope2,
  baseEmissions,
}) => {
  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title className="fw-bold mb-1">기준연도 배출량</Card.Title>
        <div className="text-muted small mb-3">
          이 값이 모든 감축 계산의 출발점입니다.
        </div>

        <Row className="g-3">
          <Col md={4}>
            <Form.Label className="small text-muted">기준연도</Form.Label>
            <Form.Control
              type="number"
              value={baseYear}
              onChange={(e) => setBaseYear(Number(e.target.value))}
            />
          </Col>

          <Col md={4}>
            <Form.Label className="small text-muted">Scope1 (tCO₂e)</Form.Label>
            <Form.Control
              type="number"
              value={scope1}
              onChange={(e) => setScope1(Number(e.target.value))}
            />
          </Col>

          <Col md={4}>
            <Form.Label className="small text-muted">Scope2 (tCO₂e)</Form.Label>
            <Form.Control
              type="number"
              value={scope2}
              onChange={(e) => setScope2(Number(e.target.value))}
            />
          </Col>
        </Row>

        <Row className="g-3 mt-2">
          <Col md={4}>
            <Form.Label className="small text-muted">합계(Scope1+2)</Form.Label>
            <Form.Control type="number" value={baseEmissions} readOnly />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default BaseInventoryCard;
