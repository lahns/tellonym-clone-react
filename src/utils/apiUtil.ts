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
    access_token: AccessToken | null = null,
): Promise<Response> => {
    let result = await fetchApiRaw(route, method, json, access_token);

    if (result.status === 401 && access_token) {
        let refresh_res = await fetchApiRaw("/refresh", "POST");

        if (refresh_res.status === 401) {
            return new Promise((_, rej) => rej("Not logged in"));
        }

        access_token.token = await refresh_res.text();

        return await fetchApiRaw(route, method, json, access_token);
    }

    return result;
}

export const apiEditProfile = async (token: AccessToken, form_data: FormData) => {
    await fetchApi(
        "/editprofile",
        "POST",
        { data: form_data, __type: "form" } as FormBody,
        token
    )
}

export const apiMe = async (token: AccessToken): Promise<UserWithLikes | null> => {
    return await fetchApi(
        "/me",
        "GET",
        null,
        token
    ).then(res => {
        if (res.ok) {
            return res.json()
        } else {
            return null;
        }
    }) as UserWithLikes | null;  
}

export const apiLogIn = async (userData: LoginData): Promise<AccessToken> => {
    //login user example
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

export const apiRegisterUser = async (userData: LoginData, token: AccessToken) => {
    await fetchApi(
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

export const apiFollow = async (user_id: number, token: AccessToken) => {
    await fetchApi(
        `/users/${user_id}/follow`,
        "POST",
        null,
        token,
    );
}

export const apiAskQuestion = async ( question: AskData, user_id: number, token: AccessToken) => {
    await fetchApi(
        `/users/${user_id}/ask`,
        "POST",
        { data: question, __type: "json" } as JSONBody,
        token,
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

export const apiAnswerQuestion = async (question_id: number, token: AccessToken, answer: AnswerData) => {
    await fetchApi(
        `/questions/${question_id}/answer`,
        "POST",
        { data: answer, __type: "json" } as JSONBody,
        token,
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