import { useRef } from "react";
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
  setQuestion: (func: (qwa: QuestionWithAnswer) => QuestionWithAnswer) => void;
};

const Question = ({
  questionWithAnswer,
  asker,
  setSelected,
  selected,
  position,
  showAsked,
  asked,
  setQuestion,
}: QuestionProps) => {
  const { question, answer } = questionWithAnswer;
  const context = useAppContext();

  const isLoggedIn = context.context.currentUser ? true : false;

  const answer_ref = useRef<HTMLTextAreaElement>(null);

  const questionIsLiked = context.context.currentUser?.likes.find(
    (like) =>
      like.resource_id == question.id && like.like_type == "QuestionLike"
  );
  const questionIsDisliked = context.context.currentUser?.likes.find(
    (like) =>
      like.resource_id == question.id && like.like_type == "QuestionDislike"
  );
  const answerIsLiked = context.context.currentUser?.likes.find(
    (like) => like.resource_id == answer?.id && like.like_type == "AnswerLike"
  );
  const answerIsDisliked = context.context.currentUser?.likes.find(
    (like) =>
      like.resource_id == answer?.id && like.like_type == "AnswerDislike"
  );

  const answerQuestion = () => {
    apiAnswerQuestion(
      question.id,
      { content: answer_ref.current!.value },
      context
    ).then(() => {
      //id should be returned from api call
      setQuestion((qwa) => {
        qwa.answer = {
          question_id: qwa.question.id,
          id: -1,
          answered_at: new Date(Date.now()).toISOString(),
          last_edit_at: new Date(Date.now()).toISOString(),
          likes: 0,
          content: answer_ref.current!.value,
        };
        return qwa;
      });
      setSelected();
    });
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
              className={`scale-5 h-5 fill-text-header rounded-full ${
                questionIsLiked && "bg-primary-light"
              }`}
              onClick={() => {
                likeResource(questionWithAnswer, "QuestionLike", context);
                get_question(question.id).then((res) =>
                  setQuestion((self) => {
                    self.question.likes = res?.question.likes!;
                    return self;
                  })
                );
              }}
            ></ThumbsUp>
            <p className="text-center">{question.likes}</p>
            <ThumbsDown
              className={`scale-5 h-5 fill-text-header rounded-full ${
                questionIsDisliked && "bg-primary-light"
              }`}
              onClick={() => {
                likeResource(questionWithAnswer, "QuestionDislike", context);
                get_question(question.id).then((res) =>
                  setQuestion((self) => {
                    self.question.likes = res?.question.likes!;
                    return self;
                  })
                );
              }}
            ></ThumbsDown>
          </div>
        </div>
        <div className="Answer flex flex-col gap-2 pt-4">
          {answer ? (
            <>
              <div className="flex flex-row gap-2 items-center">
                <p className="font-thin text-base text-gray-onBg">
                  Answer from {asked.username}
                </p>
                {answer.last_edit_at !== answer.answered_at ? (
                  <p className="font-thin text-sm text-gray-onBg">
                    (Edited on {answer.last_edit_at})
                  </p>
                ) : null}
              </div>
              <div className="flex flex-row gap-2 justify-between">
                <div className="Answer border-l-2">
                  <p className="pl-2">{answer.content}</p>
                </div>
                <div className="flex flex-col md:flex-col justify-items-center">
                  <ThumbsUp
                    className={`scale-5 h-5 fill-text-header rounded-full ${
                      answerIsLiked && "bg-primary-light"
                    }`}
                    onClick={() => {
                      likeResource(questionWithAnswer, "AnswerLike", context);
                      get_question(question.id).then((res) =>
                        setQuestion((self) => {
                          self.answer!.likes = res?.answer?.likes!;
                          return self;
                        })
                      );
                    }}
                  ></ThumbsUp>
                  <p className="text-center">{answer.likes}</p>
                  <ThumbsDown
                    className={`scale-5 h-5 fill-text-header rounded-full ${
                      answerIsDisliked && "bg-primary-light"
                    }`}
                    onClick={() => {
                      likeResource(
                        questionWithAnswer,
                        "AnswerDislike",
                        context
                      );
                      get_question(question.id).then((res) =>
                        setQuestion((self) => {
                          self.answer!.likes = res?.answer?.likes!;
                          return self;
                        })
                      );
                    }}
                  ></ThumbsDown>
                </div>
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
                  {answer ? "Edit answer" : "Answer"}
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
