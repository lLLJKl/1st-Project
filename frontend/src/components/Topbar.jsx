import { Form, FormControl } from "react-bootstrap";

const Topbar = () => {
  return (
    <div className="topbar d-flex align-items-center px-4">
      <Form className="flex-grow-1 me-3">
        <FormControl placeholder="프로젝트 검색..." />
      </Form>
      <div className="fw-semibold">홍길동</div>
    </div>
  );
};

export default Topbar;
