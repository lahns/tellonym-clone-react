import { Link } from "wouter";
import { ReactComponent as ThumbsDown } from "./icons/thumbs_down.svg";
import { ReactComponent as ThumbsUp } from "./icons/thumbs_up.svg";
import { QuestionWithAnswer, User } from "./types";
import { like_answer, like_question } from "./utils/apiUtil";
import { useContext, useState } from "react";
import { useAppContext } from "./context";

type QuestionProps = {
  questionWithAnswer: QuestionWithAnswer;
  asker: User | null;
};

const Question = ({ questionWithAnswer, asker }: QuestionProps) => {
  const { question, answer } = questionWithAnswer;
  const context = useAppContext();

  const [likeCount, setLike] = useState(question.likes);

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
            <ThumbsUp
              className="scale-5 h-5 fill-slate-200 hover:white"
              onClick={() => {
                if (context.context.currentUser) {
                  like_question(questionWithAnswer, true, context);
                  context.setContext({
                    ...context.context,
                    currentUser: {
                      ...context.context.currentUser,
                      likes: [
                        ...context.context.currentUser.likes,
                        {
                          like_type: "QuestionLike",
                          liker_id: context.context.currentUser.user.id,
                          resource_id: question.id,
                        },
                      ],
                    },
                  });
                }
              }}
            ></ThumbsUp>
            <p className="text-center">{likeCount}</p>
            <ThumbsDown
              className="scale-5 h-5 fill-slate-200"
              onClick={() => {
                if (context.context.currentUser) {
                  like_question(questionWithAnswer, false, context);
                  context.setContext({
                    ...context.context,
                    currentUser: {
                      ...context.context.currentUser,
                      likes: [
                        ...context.context.currentUser.likes,
                        {
                          like_type: "QuestionDislike",
                          liker_id: context.context.currentUser.user.id,
                          resource_id: question.id,
                        },
                      ],
                    },
                  });
                }
              }}
            ></ThumbsDown>
          </div>
        </div>
        <div className="Answer flex flex-row justify-between">
          {answer ? (
            <>
              <div className="Answer border-l-2">
                <p className="pl-2">{answer.content}</p>
              </div>
              <div className="flex flex-col md:flex-col justify-items-center">
                <ThumbsUp
                  className="scale-5 h-5 fill-white"
                  onClick={() => like_answer(questionWithAnswer, true, context)}
                ></ThumbsUp>
                <p className="text-center">{answer.likes}</p>
                <ThumbsDown
                  className="scale-5 h-5 fill-white "
                  onClick={() =>
                    like_answer(questionWithAnswer, false, context)
                  }
                ></ThumbsDown>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Question;
