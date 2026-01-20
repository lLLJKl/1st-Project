import { useState } from 'react';
import reactLogo from '@/assets/react.svg'
import viteLogo from '/vite.svg'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Sidebar from '@/components/sidebar/Sidebar';
import SectionCard from '@/components/mypage/SectionCard';
import InfoItem from '@/components/mypage/InfoItem'
import Buttons from '@/components/CreateAccount/Buttons'
import CreateAccount from '@/components/CreateAccount/CreateAccount'
import Input from '@/components/CreateAccount/Input'
import Radio from '@/components/CreateAccount/Radio'
import Login from '@/components/Login/Login'
import { Container , Row, Col } from 'react-bootstrap'


import '@/App.css'

function App () {

  const currentUSer ={
    userId:"kyrie2",
    userEmail:"jtw8983@naver.com",
    userName:"장태원"
  }

  const userData = {
    name: "장태원",
    phone: "+82 10-2***-4***",
    email: "jtw8983@naver.com",
    isTwoFactorAuth: true,
    isOverseasLoginBlocked: true
  }

  return (
    <>
    <div style={{ backgroundColor: '#f5f6f7', minHeight: '100vh' }}>
      <Container fluid>
        <Row>
          <Col md={3} lg={2} className="p-0">
            <Sidebar name={currentUSer.userId} email={currentUSer.userEmail}></Sidebar>
          </Col>
          <Col md={9} lg={10} className="p-4">
            
            <SectionCard title="내프로필">
              <InfoItem icon="person" title="이름" content={userData.name}  actionType="button" />
              <InfoItem icon="phone" title="연락처" content={userData.phone} actionType="button" />
              <InfoItem icon="envelope" title="이메일" content={userData.email} actionType="button" />
            </SectionCard>

            <SectionCard title="보안설정">
              <InfoItem icon="lock" title="비밀번호" actionType="button" />
              <InfoItem icon="shield-check" title="2단계 인증" actionType="switch" />
              <InfoItem icon="globe" title="해외 로그인 차단" actionType="switch" />
            </SectionCard>

          </Col>
        </Row>
      </Container>
    </div>
      
    </>
  )
}

export default App
