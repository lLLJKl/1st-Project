import { useState } from "react";


const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async e => {
    e.preventDefault();
    setError("");

    // 🔹 간단 유효성
    if (!form.email || !form.password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);

      // 🔹 API 연동 자리
      /*
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error("로그인 실패");
      */

      console.log("로그인 데이터:", form);
      alert("로그인 성공!");

    } catch (err) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="col-12 col-md-5 col-lg-4">
        <div className="card shadow-sm login-card">

          <div className=" text-center bg-white login-card card-header">
            <h4 className="mb-0">로그인</h4>
          </div>

          <div className="card-body ">
            {error && (
              <div className="alert alert-danger">{error}</div>
            )}

            <form onSubmit={onSubmit}>
              {/* Email */}
              <div className="mb-3">
                <label className="form-label">이메일</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="email@example.com"
                />
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label">비밀번호</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    로그인 중...
                  </>
                ) : (
                  "로그인"
                )}
              </button>
            </form>
          </div>

          <div className="card-footer text-center bg-white">
            <small>
              계정이 없으신가요? <a href="/signup">회원가입</a>
            </small>
            <br />
            <a href="/find-password" className="small">
              비밀번호를 잊으셨나요?
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
