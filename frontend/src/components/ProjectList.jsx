const ProjectList = ({ projects }) => {
  if (projects.length === 0) {
    return <div className="text-muted small">등록된 프로젝트가 없습니다.</div>;
  }

  return (
    <ul className="list-group list-group-flush">
      {projects.map(p => (
        <li
          key={p.id}
          className="list-group-item d-flex justify-content-between"
        >
          <span>{p.name}</span>
          <span className="text-success">-{p.reduction} tCO₂</span>
        </li>
      ))}
    </ul>
  );
};

export default ProjectList;
