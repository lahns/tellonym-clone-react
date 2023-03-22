import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Question from "./Question";
import { QuestionWithAnswer, User } from "./types";
import { apiGetUserQuestions, apiUser } from "./utils/apiUtil";

type ProfileProps = { userId: number };

type QuestionWithAnswerWithUserData = {
    qwa: QuestionWithAnswer,
    asker: User | null,
}

export default ({userId}: ProfileProps) => {
    //Needed to refresh the page when url changes
    const [location, ] = useLocation();

    const [userData, setUserData] = useState<User | null>(null);

    const [questions, setQuestions] = useState<QuestionWithAnswerWithUserData[]>([]);

    useEffect(() => {
        // Fetch user data for the profile owner
        apiUser(userId).then((data) =>
            setUserData(data)
        );

        // Fetch questions for the profile user
        apiGetUserQuestions(userId).then((data) => {
            const askerIds = data
                .filter(data => data.question.asker_id != null)
                .map(data => data.question.asker_id!);
                
            const sortedUniqueAskerIds = Array.from(new Set(askerIds)).sort();

            // Fetch asker data for each question
            const promises = sortedUniqueAskerIds.map(id => apiUser(id));

            Promise.all(promises).then((users) => {
                const idToUser = new Map();
                sortedUniqueAskerIds.forEach((id, index) => idToUser.set(id, users[index]));

                const fullData = data
                    .map(questionData => {
                        return { 
                            qwa: questionData, 
                            asker: questionData.question.asker_id ? 
                                idToUser.get(questionData.question.asker_id) : null
                        };
                });

                setQuestions(fullData);
            });
        });
    }, [location]);

    return (
        <div>{userData ? 
            <> 
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
            </>
        : "Loading..."}
        </div>
    );
}