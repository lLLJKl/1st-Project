import { Row, Col, Card, Button, ListGroup } from "react-bootstrap";

const MyPage = () => {

    
  return (
    <Row>
      {/* 왼쪽 메뉴 */}
      <Col md={3}>
        <Card>
          <Card.Body className="text-center">
            <div
              className="rounded-circle bg-secondary mx-auto mb-3"
              style={{ width: 80, height: 80 }}
            />
            <h6 className="fw-bold mb-1">이정빈</h6>
            <small className="text-muted">leejb@naver.com</small>
          </Card.Body>

          <ListGroup variant="flush">
            <ListGroup.Item action active>
              내 프로필
            </ListGroup.Item>
            <ListGroup.Item action>보안 설정</ListGroup.Item>
            <ListGroup.Item action>이력 관리</ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>

      {/* 오른쪽 콘텐츠 */}
      <Col md={9}>
        {/* 프로필 */}
        <Card className="mb-3">
          <Card.Header className="fw-bold">프로필</Card.Header>
          <Card.Body>
            <Row className="mb-2">
              <Col md={4} className="text-muted">이름</Col>
              <Col md={6}>이정빈</Col>
              <Col md={2}>
                <Button size="sm" variant="outline-secondary">수정</Button>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col md={4} className="text-muted">이메일</Col>
              <Col md={6}>lee****@naver.com</Col>
              <Col md={2}>
                <Button size="sm" variant="outline-secondary">변경</Button>
              </Col>
            </Row>

            <Row>
              <Col md={4} className="text-muted">휴대폰</Col>
              <Col md={6}>+82 10-****-****</Col>
              <Col md={2}>
                <Button size="sm" variant="outline-secondary">수정</Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* 보안 설정 */}
        <Card className="mb-3">
          <Card.Header className="fw-bold">보안 설정</Card.Header>
          <Card.Body>
            <Row className="mb-2">
              <Col md={8}>비밀번호 변경</Col>
              <Col md={4} className="text-end">
                <Button size="sm" variant="outline-secondary">변경</Button>
              </Col>
            </Row>

            <Row className="mb-2">
              <Col md={8}>2단계 인증</Col>
              <Col md={4} className="text-end">
                <Button size="sm" variant="success">ON</Button>
              </Col>
            </Row>

            <Row>
              <Col md={8}>조직 권한 할당</Col>
              <Col md={4} className="text-end">
                <Button size="sm" variant="success">ON</Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* 프로젝트 관리 */}
        <Card>
          <Card.Header className="fw-bold">내 프로젝트 관리</Card.Header>
          <Card.Body>
            <Row className="mb-2">
              <Col md={8}>내 프로젝트 현황</Col>
              <Col md={4} className="text-end">
                <Button size="sm" variant="outline-secondary">확인</Button>
              </Col>
            </Row>

            <Row>
              <Col md={8}>업로드 했던 서류,자료</Col>
              <Col md={4} className="text-end">
                <Button size="sm" variant="outline-secondary">관리</Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default MyPage;
