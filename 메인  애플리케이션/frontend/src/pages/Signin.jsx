import { Button, Form } from 'react-bootstrap';
import '@/App.css'
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
          
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Form.Check 
            type="checkbox"
            label="자동로그인"
            id="checkDefault"
            className="mb-0"
          />
        </div>
       
        <Link to ="/main" className="w-100">
          <Button variant="primary" className="w-100 py-2">
            Sign in
          </Button>
        </Link>  
       </Form> 
      </main>
    </div>
  );
};

export default Signin;
        
