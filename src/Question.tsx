import { Link } from "wouter";
import { ReactComponent as ThumbsDown } from "./icons/thumbs_down.svg";
import { ReactComponent as ThumbsUp } from "./icons/thumbs_up.svg";
import { QuestionWithAnswer, User } from "./types";
import { like_answer, like_question } from "./utils/apiUtil";
import { useContext } from "react";
import { useAppContext } from "./context";

type QuestionProps = {
  questionWithAnswer: QuestionWithAnswer;
  asker: User | null;
};

const Question = ({ questionWithAnswer, asker }: QuestionProps) => {
  const { question, answer } = questionWithAnswer;
  const context = useAppContext();

  return (
    <>
      <div className="QuestionContainer bg-slate-900 text-white text-xl text-left p-5 w-full">
        <div className="Question flex flex-row justify-between">
          <div>
            <div className="flex flex-row gap-2">
              From:{" "}
              {asker ? (
                <Link to={`/user/${asker?.id}`}>{asker.username}</Link>
              ) : (
                "Anonymous"
              )}
              <div className="text-slate-700">({question.asked_at})</div>
            </div>
            <div>{question.content}</div>
          </div>
          <div className="flex flex-col md:flex-col justify-items-center">
            <ThumbsUp className="scale-5 h-5 fill-white" onClick={() => like_question(questionWithAnswer, true, context)}></ThumbsUp>
            <p className="text-center">{question.likes}</p>
            <ThumbsDown className="scale-5 h-5 fill-white" onClick={() => like_question(questionWithAnswer, false, context)}></ThumbsDown>
          </div>
        </div>
        <div className="Answer flex flex-row justify-between">
          {answer ? (
            <>
              <div className="Answer border-l-2">
                <p className="pl-2">{answer.content}</p>
              </div>
              <div className="flex flex-col md:flex-col justify-items-center">
                <ThumbsUp className="scale-5 h-5 fill-white" onClick={() => like_answer(questionWithAnswer, true, context)}></ThumbsUp>
                <p className="text-center">{answer.likes}</p>
                <ThumbsDown className="scale-5 h-5 fill-white " onClick={() => like_answer(questionWithAnswer, false, context)}></ThumbsDown>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Question;
