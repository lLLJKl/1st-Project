const Inputs = ({ inputs }) => {
  return (
    <>
      {inputs.map((input) => (
        <div key={input.id} className="mb-3">
          <label className="form-label fw-bold" style={{ color: "#1e293b" }}>{input.name}</label>
          <input
            type={input.type}
            className="form-control"
            placeholder={input.placeholder}
            value={input.value}
            onChange={(e) => input.onChange(e.target.value)}
            required={input.required}
          />
        </div>
      ))}
    </>
  );
};
export default Inputs;