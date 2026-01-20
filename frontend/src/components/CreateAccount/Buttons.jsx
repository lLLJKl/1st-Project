const Buttons = ({ btns }) => {
  return (
    <div className="d-grid gap-2 mt-4">
      {btns.map((btn, idx) => (
        <button
          key={idx}
          type={btn.type}
          className={`btn ${btn.type === "submit" ? "btn-dark" : "btn-outline-secondary"}`}
          style={btn.type === "submit" ? { backgroundColor: "#1e293b" } : {}}
          onClick={btn.onclick}
        >
          {btn.txt}
        </button>
      ))}
    </div>
  );
};
export default Buttons;