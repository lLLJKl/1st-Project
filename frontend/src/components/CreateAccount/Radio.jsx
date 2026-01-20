const Radio = ({ userType, onChange }) => {
  return (
    <div className="d-flex gap-3 mt-1">
      <div className="form-check">
        <input className="form-check-input" type="radio" id="company" checked={userType === "company"} onChange={() => onChange("company")} />
        <label className="form-check-label" htmlFor="company">기업 담당자</label>
      </div>
      <div className="form-check">
        <input className="form-check-input" type="radio" id="employee" checked={userType === "employee"} onChange={() => onChange("employee")} />
        <label className="form-check-label" htmlFor="employee">직원</label>
      </div>
    </div>
  );
};
export default Radio;