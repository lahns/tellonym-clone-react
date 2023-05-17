import { createContext, useContext } from "react";
import { AccessToken, User, UserWithLikes } from "./types";

export type SessionData = {
  accessToken: AccessToken | null;
  currentUser: UserWithLikes | null;
  following: User[];
};

export const AppContext = createContext<{
  context: SessionData;
  setContext: (newData: SessionData) => void;
}>({
  context: {
    accessToken: null,
    currentUser: null,
    following: [],
  },
  setContext: () => {},
});

export const useAppContext = (): {
  context: SessionData;
  setContext: (newData: SessionData) => void;
} => useContext(AppContext);
