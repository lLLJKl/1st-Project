import { Button, Form } from 'react-bootstrap';
import './App.css'
import {Link} from 'react-router-dom';

const Signin = () => {
  return (
    <div className="d-flex align-items-center py-4 bg-body-tertiary vh-40 overflow-hidden">
      <main className="form-signin w-100 m-auto" style={{ maxWidth: '330px', padding: '15px' }}>
        <Form>
        
          <h1 className="h3 mb-3 fw-normal">로그인</h1>
          <Form.Group className="form-floating mb-2">
            <Form.Control
              type="email"
              id="floatingInput"
              placeholder=""
            />
            <label htmlFor="floatingInput">Email address</label>
          </Form.Group>

          <Form.Group className="form-floating mb-3">
            <Form.Control
              type="password"
              id="floatingPassword"
              placeholder=""
            />
            <label htmlFor="Password">Password</label>
          </Form.Group>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Form.Check 
            type="checkbox"
            label="자동로그인"
            id="checkDefault"
            className="mb-0"
          />
        <Link 
         to ="/findpassword"
          className="text-decoration-none small"
              style={{ fontSize: '0.9rem' }}
            >
            비밀번호찾기
            </Link>
        </div>
          <Button variant="primary" className="w-100 py-2" type="submit">
            Sign in
          </Button>
         </Form>
      </main>
    </div>
  );
};

export default Signin;
        
