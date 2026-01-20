import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProjectList = ({ projects }) => {
  if (!projects || projects.length === 0) {
    return <div className="text-muted small">등록된 프로젝트가 없습니다.</div>;
  }

  return (
    <ul className="list-group list-group-flush">
      {projects.map(p => (
        <li
          key={p.id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <span>{p.name}</span>

          <div className="d-flex gap-2 align-items-center">
            <span className="text-success">-{p.reduction} tCO₂</span>
            <Button
              as={Link}
              to={`/projects/${p.id}/roadmap`}
              variant="outline-primary"
              size="sm"
            >
              로드맵
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ProjectList;
