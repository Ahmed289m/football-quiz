import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartQuiz from "./components/StartQuiz";
import Questions from "./components/questions";
import Next from "./components/next";
import Progress from "./components/Progress";
import FinishScreen from "./components/FinishScreen";
import Footer from "./components/footer";
import Timer from "./components/Timer";
const SEC_REM = 30;
const initial = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondRemaining: null,
};
function reduce(state, action) {
  switch (action.type) {
    case "dataRecieved":
      return { ...state, status: "ready", questions: action.payload };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        secondRemaining: state.questions.length * SEC_REM,
      };
    case "end":
      return {
        ...state,
        status: "finish",
        index: 0,
        answer: null,
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };

    case "addNewAnswer":
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };

    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };

    case "restart":
      return { ...initial, status: "ready" };

    case "tick":
      return {
        ...state,
        secondRemaining: state.secondRemaining - 1,
        status: state.secondRemaining === 0 ? "finish" : state.status,
      };

    default:
      throw new Error("Unknown action type");
  }
}

export default function App() {
  const [
    { questions, status, index, answer, points, highScore, secondRemaining },
    dispatch,
  ] = useReducer(reduce, initial);
  const numOfQuestions = questions.length;

  useEffect(function () {
    async function fetchQuestions() {
      const res = await fetch("http://localhost:9000/questions");
      const data = await res
        .json()
        .catch((error) => dispatch({ type: "dataFailed" }));
      dispatch({ type: "dataRecieved", payload: data });

      console.log(data);
    }
    fetchQuestions();
  }, []);

  const maxPossiblePoints = questions.reduce(
    (prev, cur) => cur.points + prev,
    0
  );

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartQuiz length={numOfQuestions} onStart={dispatch} />
        )}

        {status === "active" && (
          <>
            <Progress
              numOfQuestions={numOfQuestions}
              answer={answer}
              index={index}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
            />

            <Questions
              question={questions[index]}
              answer={answer}
              dispatch={dispatch}
            />

            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondRemaining} />
              <Next
                dispatch={dispatch}
                answer={answer}
                numOfQuestions={numOfQuestions}
                index={index}
              />
            </Footer>
          </>
        )}
        {status === "finish" && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            dispatch={dispatch}
            highScore={highScore}
          />
        )}
      </Main>
    </div>
  );
}
