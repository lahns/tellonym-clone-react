import { createContext } from 'react';
import { AccessToken, UserWithLikes } from './types';

export type SessionData = {
    accessToken: AccessToken,
    currentUser: UserWithLikes | null,
};

export const AppContext = createContext<{ context: SessionData, setContext: (newData: SessionData) => void}>({
    context: {
        accessToken: { token: "", _marker: null },
        currentUser: null
    },
    setContext: () => {}
});