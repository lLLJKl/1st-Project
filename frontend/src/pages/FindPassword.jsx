import { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const FindPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    console.log("비밀번호 재설정 요청:", email);
    setSubmitted(true);
  };

  return (
    // 사이드바 내부에서 중앙 정렬을 위해 d-flex와 vh-100(또는 상단바 제외 높이)을 사용합니다.
    <div className="d-flex align-items-center py-4 bg-body-tertiary vh-40 overflow-hidden bg-body-tertiary">
      <main className="form-signin w-100 m-auto" style={{ maxWidth: '330px', padding: '15px' }}>
        <Form onSubmit={handleSubmit}>
          <h1 className="h3 mb-3 fw-normal text-center">비밀번호 찾기</h1>

          {!submitted ? (
            <>
              <p className="text-muted small text-center mb-4">
                가입하신 이메일 주소를 입력하시면 <br />
                안내 메일을 보내드립니다.
              </p>

              <Form.Group className="form-floating mb-3">
                <Form.Control
                  type="email"
                  id="floatingInput"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="floatingInput">Email address</label>
              </Form.Group>

              <Button variant="primary" className="w-100 py-2" type="submit">
                메일 보내기
              </Button>
            </>
          ) : (
            <div className="text-center py-3">
              <p className="fw-bold mb-1">📧 메일 발송 완료</p>
              <p className="text-muted small">메일함을 확인해주세요.</p>
            </div>
          )}

          <div className="text-center mt-4">
            <Link to="/signin" className="small text-decoration-none text-secondary">
              로그인 페이지로 돌아가기
            </Link>
          </div>
        </Form>
      </main>
    </div>
  );
};

export default FindPassword;