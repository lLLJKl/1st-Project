import { Button, Form } from 'react-bootstrap';
import '@/App.css'
import {Link, useNavigate} from 'react-router-dom';

const Signup = () => {
    const nav = useNavigate()
    const close  = () => nav("/")
    onsubmit = e =>{
        e.preventDefault()
        const param = { "email": e.target.email.value}
        console.log(param)
        close()

    }

    return(
        <>
        {/* <!-- 회원가입 영역 --> */}
		<div className="container mt-3">
			<h1 className="display-1 text-center">회원가입</h1>
			<form onSubmit={onsubmit}>
				<div className="mb-3 mt-3">
					<label htmlFor="email" className="form-label">이메일:</label>
					<input type="email" className="form-control" id="email" placeholder="이메일를 입력하세요." name="email"/>
				</div>
			<div className="d-flex">
				<Button type='submit' variant="primary" className="w-100 py-2">
                     Sign in
                </Button>
                <div className="p-2 flex-fill d-grid">
					<a href="/" className="btn btn-primary">취소</a>
				</div>
			</div>
			</form>
		</div>
        </>
    )
}
export default Signup