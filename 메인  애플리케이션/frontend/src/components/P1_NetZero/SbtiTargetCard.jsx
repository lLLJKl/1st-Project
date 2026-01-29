import { Card, Col, Form, Row } from "react-bootstrap";

const SbtiTargetCard = ({
  sbtiEnabled,
  setSbtiEnabled,
  nearTargetYear,
  setNearTargetYear,
  nearReductionPct,
  setNearReductionPct,
  netZeroYear,
  setNetZeroYear,
}) => {
  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title className="fw-bold mb-1">SBTi 모드</Card.Title>
        <div className="text-muted small mb-3">
          SBTi는 중간목표(Near-term) + 장기목표(Net-zero)가 필수입니다.
        </div>

        <Form.Check
          type="checkbox"
          id="sbti-toggle"
          label="SBTi 기준 적용"
          checked={sbtiEnabled}
          onChange={(e) => setSbtiEnabled(e.target.checked)}
          className="mb-3"
        />

        {sbtiEnabled && (
          <>
            <Row className="g-3">
              <Col md={4}>
                <Form.Label className="small text-muted">Near-term 목표 연도</Form.Label>
                <Form.Control
                  type="number"
                  value={nearTargetYear}
                  onChange={(e) => setNearTargetYear(Number(e.target.value))}
                />
              </Col>

              <Col md={4}>
                <Form.Label className="small text-muted">Near-term 감축률(%)</Form.Label>
                <Form.Control
                  type="number"
                  value={nearReductionPct}
                  onChange={(e) => setNearReductionPct(Number(e.target.value))}
                />
              </Col>

              <Col md={4}>
                <Form.Label className="small text-muted">Net-zero 목표 연도</Form.Label>
                <Form.Control
                  type="number"
                  value={netZeroYear}
                  onChange={(e) => setNetZeroYear(Number(e.target.value))}
                />
              </Col>
            </Row>

            <div className="text-muted small mt-3">
              ※ 현재 MVP는 “목표선(goal path)”만 생성합니다. 감축수단/상쇄를 붙이면 “실제선(net)”이 목표선을 따라가게 됩니다.
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default SbtiTargetCard;
