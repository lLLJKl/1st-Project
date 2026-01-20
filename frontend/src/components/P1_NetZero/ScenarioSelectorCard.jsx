import { Card, Form } from "react-bootstrap";

const ScenarioSelectorCard = ({ method, setMethod }) => {
  return (
    <Card className="shadow-sm h-100">
      <Card.Body>
        <Card.Title className="fw-bold mb-1">시나리오 방식</Card.Title>
        <div className="text-muted small mb-3">
          BAU는 “감축 조치 없음”, ACA는 “목표선 + 감축/상쇄 관리”를 의미합니다.
        </div>

        <Form>
          <Form.Check
            type="radio"
            id="method-bau"
            name="method"
            label="BAU"
            checked={method === "BAU"}
            onChange={() => setMethod("BAU")}
            className="mb-2"
          />
          <Form.Check
            type="radio"
            id="method-aca"
            name="method"
            label="ACA"
            checked={method === "ACA"}
            onChange={() => setMethod("ACA")}
          />
        </Form>

        {/* TODO: ACA 단일 목표(목표연도 %감축/절대배출/연평균감축률) 입력폼 추가 */}
      </Card.Body>
    </Card>
  );
};

export default ScenarioSelectorCard;
