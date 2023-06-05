import { useAppContext } from "../context";
import { Like, QuestionWithAnswer, User } from "../types";
import { apiFollows, apiMe, apiUser, like_answer, like_question } from "./apiUtil";

export const login = async (
  { context, setContext }: ReturnType<typeof useAppContext>,
  userErrorHandler?: () => void,
  serverErrorHandler?: (err: Error) => void
) => {
  const user = await apiMe({ context, setContext }).catch((err) => {
    if (serverErrorHandler && err instanceof Error) serverErrorHandler(err);
  });
  if (!user && userErrorHandler) return userErrorHandler();
  if (user) {
    const following = await apiFollows(user?.user.id).catch((err) => {
      if (serverErrorHandler && err instanceof Error) serverErrorHandler(err);
    });

    setContext({ ...context, currentUser: user, following: following ?? [] });
  }
};

export const fetchAskerData = async (questions: QuestionWithAnswer[]): Promise<Map<number, User>> => {
  const map = new Map();

  const askerIds = questions 
    .filter(({question}) => question.asker_id != null)
    .map(({question}) => question.asker_id!)
    
  const uniqueAskerIds = Array.from(new Set(askerIds));
  
  const promises = uniqueAskerIds.map((id) => {
    return apiUser(id).then((userData) => {
      if (!userData) return; //User does not exist for some reason

      return () => { map.set(id, userData); }
    })
  });

  await Promise.all(promises).then(funcs => funcs.forEach(func => func && func()));

  return map;
}

export function likeResource(questionWithAnswer : QuestionWithAnswer, likeType : Like["like_type"], {context, setContext}: ReturnType<typeof useAppContext>){
  if (context.currentUser) {

    const like_or_dislike = likeType == "QuestionLike" || likeType == "AnswerLike" ? true : false;

    if(likeType == "QuestionLike" || likeType == "QuestionDislike"){
      like_question(questionWithAnswer, like_or_dislike, {context, setContext});

      let Likes = context.currentUser.likes;
      let answer_likes = Likes.filter(like => like.like_type == "AnswerLike" || like.like_type =="AnswerDislike");
      let question_likes = Likes.filter(like => like.resource_id != questionWithAnswer.question.id && (like.like_type == "QuestionLike" || like.like_type == "QuestionDislike"));

      let new_likes = [...answer_likes, ...question_likes]

      setContext({
        ...context,
        currentUser: {
          ...context.currentUser,
          likes: [
            ...new_likes,
            {
              like_type: likeType,
              liker_id: context.currentUser.user.id,
              resource_id: questionWithAnswer.question.id,
            },
          ],
        },
      });
    }
    else{

      like_answer(questionWithAnswer, like_or_dislike, {context, setContext});

      let Likes = context.currentUser.likes;
      let answer_likes = Likes.filter(like => like.like_type == "QuestionLike" || like.like_type =="QuestionDislike");
      let question_likes = Likes.filter(like => like.resource_id != questionWithAnswer.answer!.id && (like.like_type == "AnswerLike" || like.like_type == "AnswerDislike"));

      let new_likes = [...answer_likes, ...question_likes]

      setContext({
        ...context,
        currentUser: {
          ...context.currentUser,
          likes: [
            ...new_likes,
            {
              like_type: likeType,
              liker_id: context.currentUser.user.id,
              resource_id: questionWithAnswer.answer!.id,
            },
          ],
        },
      });
    }
  }
}