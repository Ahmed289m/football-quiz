export default function StartQuiz({ length, onStart }) {
  return (
    <div className="start">
      <h2>Welcome To Football Quiz!</h2>
      <h3>{length} Questions to Test your Sports knowledge</h3>
      <button onClick={() => onStart({ type: "start" })} className="btn btn-ui">
        let's start
      </button>
    </div>
  );
}
