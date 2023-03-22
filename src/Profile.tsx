import { useEffect, useState } from "react";
import Question from "./Question";
import { QuestionWithAnswer, User } from "./types";
import { apiGetUserQuestions, apiUser } from "./utils/apiUtil";

type ProfileProps = { userId: number };

type QuestionWithAnswerWithUserData = {
    qwa: QuestionWithAnswer,
    asker: User | null,
}

export default ({userId}: ProfileProps) => {

    const [userData, setUserData] = useState<User>({
        id: 0,
        username: "Loading...",
        follower_count: 0,
        following_count: 0,
        bio: ""
    });

    const [questions, setQuestions] = useState<QuestionWithAnswerWithUserData[]>([]);

    useEffect(() => {
        apiUser(userId).then((data: User) =>
            setUserData(data)
        );

        apiGetUserQuestions(userId).then((data: QuestionWithAnswer[]) => {
            const promises = data.map(questionData => {
                if (questionData.question.asker_id) {
                    return apiUser(questionData.question.asker_id)
                } else {
                    return null
                }
            });

            Promise.all(promises).then((users) => {
                const fullData = data.map((questionData, index) => {
                    return { qwa: questionData, asker: users[index]};
                });

                setQuestions(fullData);
            });
        });
    }, []);

    return (
        <div>
            <div>
                <p>{userData.username}</p>
                <p>Followers: {userData.follower_count}</p>
                <p>Following: {userData.following_count}</p>
                {userData.bio !== "" ? <p>Bio: {userData.bio}</p> : null}
            </div>
            <div>
                <h1 className="text-xl"> PYTANIA: </h1>
                {questions.map(({qwa, asker}, index) =>
                    <Question key={index} questionWithAnswer={qwa} asker={asker}></Question>
                )}
            </div>
        </div>
    );
}