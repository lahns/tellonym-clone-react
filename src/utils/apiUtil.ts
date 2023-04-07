import { useAppContext } from "../context";
import { AccessToken, AnswerData, AskData, LoginData, QuestionWithAnswer, User, UserWithLikes, VoteData } from "../types";
import config from "./config";

type JSONBody = {
    data: LoginData | AskData | AnswerData | VoteData,
    __type: "json",
};

type FormBody = {
    data: FormData,
    __type: "form",
};

const isJSON = (x: JSONBody | FormBody): x is JSONBody => {
    return x.__type === "json";
} 

//Doesnt try to refresh token after an unauthorized request
const fetchApiRaw = async (
    route: string, 
    method: "POST" | "GET", 
    body: JSONBody | FormBody | null = null,
    access_token: AccessToken | null = null,
): Promise<Response> => fetch(`${config.ServerURL}${route}`, {
        ...(body && isJSON(body) && { body: JSON.stringify(body.data) }),
        ...(body && !isJSON(body) && { body: body.data }),
        headers: {
            "Bypass-Tunnel-Reminder": "true",
            ...(body && isJSON(body) && { "Content-Type": "application/json" }),
            ...(access_token && { "Authorization": `Bearer: ${access_token.token}` }),
        },
        credentials: "include",
        method: method,
    })


export const fetchApi = async (
    route: string,
    method: "POST" | "GET",
    json: JSONBody | FormBody | null = null,
    context: ReturnType<typeof useAppContext> | null = null
): Promise<Response> => {
    let result = await fetchApiRaw(route, method, json, context?.context.accessToken);

    if (result.status === 401 && context?.context.accessToken) {

        return await apiRefresh()
            .then(token => {
                if (!token) {
                    throw new Error("not logged in");
                }

                context.setContext({...context.context, accessToken: token});
                return fetchApiRaw(route, method, json, token);
            });
    }

    return result;
}

export const apiRefresh = async (): Promise<AccessToken | null> => {
    return await fetchApiRaw("/refresh", "POST")
        .then(res => {
            return res.text().then(resText => {
                if (res.status === 401) {
                    return null;
                } else {
                    return { token: resText, _marker: null };
                }            
            });
        });
}

export const apiEditProfile = async (form_data: FormData, context: ReturnType<typeof useAppContext>) => {
    await fetchApi(
        "/editprofile",
        "POST",
        { data: form_data, __type: "form" } as FormBody,
        context,
    )
}

export const apiMe = async (context: ReturnType<typeof useAppContext>): Promise<UserWithLikes | null> => {
    return await fetchApi(
        "/me",
        "GET",
        null,
        context
    ).then(res => {
        if (res.ok) {
            return res.json()
        } else {
            return null;
        }
    }) as UserWithLikes | null;  
}

export const apiLogIn = async (userData: LoginData): Promise<AccessToken> => {
    return await fetchApi(
        "/login", 
        "POST", 
        { data: userData, __type: "json" } as JSONBody,
    ).then(res => {
        return res.text().then(resText => {
            if (res.ok) {
                return { token: resText, _marker: null } ;
            } else {
                throw new Error(resText);
            }
        });
    });
}

export const apiLogOut = async () => {
    await fetchApi(
        "/logout",
        "POST",
    );
}

export const apiRegisterUser = async (userData: LoginData): Promise<AccessToken> => {
    return await fetchApi(
        "/register", 
        "POST", 
        { data: userData, __type: "json" } as JSONBody,
    ).then(res => {
        return res.text().then(resText => {
            if (res.ok) {
                return { token: resText, _marker: null } ;
            } else {
                throw new Error(resText);
            }
        });
    });
}

export const apiFollow = async (user_id: number, context: ReturnType<typeof useAppContext>) => {
    await fetchApi(
        `/users/${user_id}/follow`,
        "POST",
        null,
        context,
    );
}

export const apiAskQuestion = async ( question: AskData, user_id: number, context: ReturnType<typeof useAppContext>) => {
    await fetchApi(
        `/users/${user_id}/ask`,
        "POST",
        { data: question, __type: "json" } as JSONBody,
        context,
    );
}

export const apiGetUserQuestions = async (user_id: number): Promise<QuestionWithAnswer[] | null> => {
    return await fetchApi(
        `/users/${user_id}/questions`,
        "GET",
    )
    .then(res => {
        if (res.ok) {
            return res.json()
        } else {
            return null;
        }
    }) as QuestionWithAnswer[] | null;
}

export const apiAnswerQuestion = async (question_id: number, answer: AnswerData, context: ReturnType<typeof useAppContext>) => {
    await fetchApi(
        `/questions/${question_id}/answer`,
        "POST",
        { data: answer, __type: "json" } as JSONBody,
        context,
    )
}

export const apiUser = async (id: number): Promise<User | null> => {    
    return await fetchApi(
        `/users/${id}`,
        "GET",
    )
    .then(res => {
        if (res.ok) {
            return res.json()
        } else {
            return null;
        }
    }) as User | null;        
}

//Add like/dislike api helpers