import { useRef, useState } from "react";
import { Link } from "wouter";
import Button from "./Button";
import Textarea from "./Textarea";
import { useAppContext } from "./context";
import { ReactComponent as ThumbsDown } from "./icons/thumbs_down.svg";
import { ReactComponent as ThumbsUp } from "./icons/thumbs_up.svg";
import { QuestionWithAnswer, User } from "./types";
import { apiAnswerQuestion, get_question } from "./utils/apiUtil";
import config from "./utils/config";
import { likeResource } from "./utils/utils";

type QuestionProps = {
  questionWithAnswer: QuestionWithAnswer;
  asker: User | null;
  asked: User;
  setSelected: () => void;
  selected: boolean;
  position: "first" | "last" | null;
  showAsked: boolean;
};

const Question = ({
  questionWithAnswer,
  asker,
  setSelected,
  selected,
  position,
  showAsked,
  asked,
}: QuestionProps) => {
  const { question, answer } = questionWithAnswer;
  const context = useAppContext();

  const [likeCount, setLike] = useState(question.likes);

  const isLoggedIn = context.context.currentUser ? true : false;

  const answer_ref = useRef<HTMLTextAreaElement>(null);

  const answerQuestion = () => {
    apiAnswerQuestion(
      question.id,
      { content: answer_ref.current!.value },
      context
    ).then(() => setSelected());
  };

  return (
    <>
      <div
        className={`QuestionContainer bg-white border-gray-outline border-2 text-text-secondary text-xl text-left p-5 w-full ${
          !position ? "border-y-0" : ""
        } ${position == "first" ? "rounded-t-lg border-b-0" : ""} ${
          position == "last" ? "rounded-b-lg border-t-0" : ""
        }`}
      >
        <div className="Question flex flex-row justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 text-text-secondary font-medium">
              <p className="font-thin text-gray-onBg">From: </p>
              {asker ? (
                <>
                  <img
                    alt=""
                    src={`${config.ServerURL}/pfps/${asker.id}.png`}
                    className="text-text-header rounded-full h-8 w-8"
                  />
                  <Link to={`/user/${asker?.id}`}>{asker.username}</Link>
                </>
              ) : (
                <>
                  <img
                    alt=""
                    src={`${config.ServerURL}/pfps/0.jpg`}
                    className="text-text-header rounded-full h-8 w-8"
                  />
                  <p>Anonymous</p>
                </>
              )}
              {showAsked ? (
                <>
                  <p className="font-thin text-gray-onBg">to</p>
                  <img
                    alt=""
                    src={`${config.ServerURL}/pfps/${asked.id}.png`}
                    className="text-text-header rounded-full h-8 w-8"
                  />
                  <Link to={`/user/${question.asked_id}`}>
                    {asked.username}
                  </Link>
                </>
              ) : null}
              <div className="text-gray-onBg font-thin">
                ({question.asked_at})
              </div>
            </div>
            <div className="font-thin">{question.content}</div>
          </div>
          <div className="flex flex-col md:flex-col justify-items-center">
            <ThumbsUp
              className="scale-5 h-5 fill-slate-200 hover:white"
              onClick={() => [likeResource(questionWithAnswer, "QuestionLike", context),get_question(question.id)
              .then(res => setLike(res?.question.likes!)) ]}
            ></ThumbsUp>
            <p className="text-center">{likeCount}</p>
            <ThumbsDown
              className="scale-5 h-5 fill-slate-200"
              onClick={() => [likeResource(questionWithAnswer, "QuestionDislike", context),get_question(question.id)
              .then(res => setLike(res?.question.likes!)) ]}
            ></ThumbsDown>
          </div>
        </div>
        <div className="Answer flex flex-col gap-2 pt-4">
          {answer ? (
            <>
              <div className="Answer border-l-2">
                <p className="pl-2">{answer.content}</p>
              </div>
              <div className="flex flex-col md:flex-col justify-items-center">
                <ThumbsUp
                  className="scale-5 h-5 fill-white"
                  onClick={() => [likeResource(questionWithAnswer, "AnswerLike", context), get_question(question.id)
                  .then(res => setLike(res?.question.likes!)) ]}
                ></ThumbsUp>
                <p className="text-center">{answer.likes}</p>
                <ThumbsDown
                  className="scale-5 h-5 fill-white "
                  onClick={() =>
                    [likeResource(questionWithAnswer, "AnswerDislike", context), get_question(question.id)
                    .then(res => setLike(res?.question.likes!)) ]
                  }
                ></ThumbsDown>
              </div>
            </>
          ) : null}
          {isLoggedIn &&
          question.asked_id == context.context.currentUser!.user.id ? (
            selected ? (
              <div className="w-full flex flex-col items-end gap-2 py-2">
                <Textarea ref={answer_ref} placeholder="Your answer" />
                <div className="flex flex-row gap-2">
                  <Button.Cancel onClick={() => setSelected()}>
                    Cancel
                  </Button.Cancel>
                  <Button.Primary onClick={() => answerQuestion()}>
                    Answer
                  </Button.Primary>
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-row py-2">
                <Button.Secondary onClick={() => setSelected()}>
                  Answer
                </Button.Secondary>
              </div>
            )
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Question;
