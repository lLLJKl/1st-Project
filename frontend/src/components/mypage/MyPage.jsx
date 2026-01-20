import Sidebar from "@/sidebar/Sidebar.jsx";
import SectionCard from "@/mypage/SectionCard.jsx";
import InfoItem from "@mypage/InfoItem.jsx";
import { Container, Row, Col } from "react-bootstrap";

const MyPage = () => {
  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Container fluid>
        <Row>
          <Col md={3} lg={2} className="p-0">
            <Sidebar name="사용자" email="user@email.com" />
          </Col>
          <Col md={9} lg={10} className="p-4">
            <SectionCard title="내프로필">
              <InfoItem icon="person" title="이름" content="장태원" actionType="button" />
              {/* 필요한 항목들을 추가 */}
            </SectionCard>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MyPage;