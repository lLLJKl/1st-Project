import { Card, Form, Badge } from "react-bootstrap";

/**
 * Goal-setting method selector
 * - Forecasting: BAU 전망(공통) + 감축활동(measures) 기반으로 "달성가능"을 계산/제안
 * - Backcasting: 외부 요구/목표(SBTi 등)를 먼저 고정하고 필요한 감축량/갭을 계산
 *
 * BAU 자체는 "baseline(전망선)"이므로 BauAssumptionCard에서 설정(성장률 등)
 */
const ScenarioSelectorCard = ({ goalMethod, setGoalMethod }) => {
  return (
    <Card className="shadow-sm h-100">
      <Card.Body>
        <Card.Title className="fw-bold mb-1">목표 설정 방식</Card.Title>
        <div className="text-muted small mb-3">
          <div className="mb-1">
            <Badge bg="light" text="dark" className="me-2">
              Forecasting
            </Badge>
            감축수단(활동)을 먼저 입력하고 달성 가능한 감축량을 종합해 목표를 설정/제안
          </div>
          <div>
            <Badge bg="light" text="dark" className="me-2">
              Backcasting
            </Badge>
            목표를 먼저 고정(SBTi/고객사 요구 등)하고 목표 달성에 필요한 감축수단/강도를 역산
          </div>
        </div>

        <Form>
          <Form.Check
            type="radio"
            id="goal-method-forecasting"
            name="goalMethod"
            label="Forecasting"
            checked={goalMethod === "FORECASTING"}
            onChange={() => setGoalMethod("FORECASTING")}
            className="mb-2"
          />
          <Form.Check
            type="radio"
            id="goal-method-backcasting"
            name="goalMethod"
            label="Backcasting"
            checked={goalMethod === "BACKCASTING"}
            onChange={() => setGoalMethod("BACKCASTING")}
          />
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ScenarioSelectorCard;
