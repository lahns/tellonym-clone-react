export class AccessToken {
    token: string = "";
    _marker: any = null;
};

export type Question = {
    id: number,
    content: string,
    likes: number,
    asked_id: number,
    asker_id: number | null,
    asked_at: string,
};

export type Answer = {
    id: number,
    question_id: number,
    content: string,
    likes: number,
    answered_at: string,
    last_edit_at: string,
};

export type QuestionWithAnswer = {
    question: Question,
    answer: Answer | null,
};

export type User = {
    id: number,
    username: string,
    follower_count: number,
    following_count: number,
    bio: string,
};

export type Like = { 
    liker_id: number,
    like_type: "QuestionLike" | "QuestionDislike" | "AnswerLike" | "AnswerDislike",
    resource_id: number,
};

export type UserWithLikes = {
    user: User,
    likes: Like[],
};

export type LoginData = {
    username: string,
    password: string,
};

export type AskData = {
    anonymous: boolean,
    content: string,
};

export type AnswerData = {
    content: string,
};

export type VoteData = {
    is_like: boolean,
};