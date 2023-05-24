import { useAppContext } from "../context";
import { QuestionWithAnswer, User } from "../types";
import { apiFollows, apiMe, apiUser } from "./apiUtil";

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