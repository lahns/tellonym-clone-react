import { createContext, useContext } from 'react';
import { AccessToken, UserWithLikes } from './types';

export type SessionData = {
    accessToken: AccessToken | null,
    currentUser: UserWithLikes | null,
};

export const AppContext = createContext<{ context: SessionData, setContext: (newData: SessionData) => void}>({
    context: {
        accessToken: null,
        currentUser: null
    },
    setContext: () => {}
});

export const useAppContext = (): { 
    context: SessionData, 
    setContext: (newData: SessionData) => void 
} => useContext(AppContext);