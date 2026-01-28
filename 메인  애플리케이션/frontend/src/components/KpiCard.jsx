import { Card } from "react-bootstrap";

const KpiCard = ({ title, value, sub }) => {
  return (
    <Card className="kpi-card">
      <Card.Body>
        <small className="text-muted">{title}</small>
        <h3 className="fw-bold mt-2">{value}</h3>
        <small className="text-success">{sub}</small>
      </Card.Body>
    </Card>
  );
};

export default KpiCard;
