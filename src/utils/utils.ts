import { useAppContext } from "../context";
import { apiFollows, apiMe } from "./apiUtil";

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