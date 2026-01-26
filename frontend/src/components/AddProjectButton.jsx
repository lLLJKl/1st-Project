import { Button } from "react-bootstrap";

const AddProjectButton = ({ onClick }) => {
  return (
    <Button
      size="sm"
      variant="outline-primary"
      className="rounded-pill"
      onClick={onClick}
    >
      + 프로젝트 추가
    </Button>
  );
};

export default AddProjectButton;
