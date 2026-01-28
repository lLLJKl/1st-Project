import { useState } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const FindPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) return;

    // 🔹 나중에 API 연결 위치
    console.log("비밀번호 재설정 요청:", email);

    setSubmitted(true);
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ Height: "100vh" }}
    >
      <Card style={{ width: "400px" }}>
        <Card.Body>
          <h5 className="fw-bold mb-3 text-center">비밀번호 찾기</h5>

          {!submitted ? (
            <>
              <p className="text-muted small text-center">
                가입하신 이메일 주소를 입력하시면  
                비밀번호 재설정 안내 메일을 보내드립니다.
              </p>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>이메일</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button type="submit" className="w-100">
                  비밀번호 재설정 메일 보내기
                </Button>
              </Form>
            </>
          ) : (
            <div className="text-center">
              <p className="fw-semibold">
                📧 메일이 발송되었습니다
              </p>
              <p className="text-muted small">
                메일함을 확인해주세요.
              </p>
            </div>
          )}

          <div className="text-center mt-3">
            <Link to="/Signin" className="small">
              로그인 페이지로 돌아가기
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default FindPassword;
