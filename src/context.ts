import { createContext } from 'react';
import { AccessToken, UserWithLikes } from './types';

type SessionData = {
    accessToken: AccessToken,
    currentUser: UserWithLikes | null,
};

const AppContext = createContext<SessionData>(
    {
        accessToken: { token: "", _marker: null },
        currentUser: null
    }
);

export default AppContext;