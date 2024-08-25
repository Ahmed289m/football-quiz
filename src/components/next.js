export default function Next({ dispatch, answer, numOfQuestions, index }) {
  if (answer == null) return null;

  if (index < numOfQuestions - 1)
    return (
      <button
        onClick={() => dispatch({ type: "nextQuestion" })}
        className="btn btn-ui"
      >
        Next
      </button>
    );

  if (index === numOfQuestions - 1)
    return (
      <button onClick={() => dispatch({ type: "end" })} className="btn btn-ui">
        Finish
      </button>
    );
}
