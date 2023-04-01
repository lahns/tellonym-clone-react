import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Question from "./Question";
import { QuestionWithAnswer, User } from "./types";
import { apiGetUserQuestions, apiUser } from "./utils/apiUtil";
import config from "./utils/config";

type ProfileProps = { userId: number };

export default ({userId}: ProfileProps) => {
    //Needed to refresh the page when url changes
    const [location, ] = useLocation();

    const [userData, setUserData] = useState<User | null>(null);

    const [questions, setQuestions] = useState<QuestionWithAnswer[]>([]);
    const [askers, setAskers] = useState<Map<number, User>>(new Map());

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

            askerIds.forEach(id => {
                apiUser(id).then(userData => {
                    setAskers(map => new Map(map.set(id, userData))); 
                });

            });
            
            setQuestions(data);
        });
    }, [location]);

    return (
        <div>{userData ? 
            <> 
                <div>
                    <img className="rounded-full w-96 h-96" alt="" src={`${config.ServerURL}/pfps/${userData.id}.png`}></img>
                    <p>{userData.username}</p>
                    <p>Followers: {userData.follower_count}</p>
                    <p>Following: {userData.following_count}</p>
                    {userData.bio !== "" ? <p>Bio: {userData.bio}</p> : null}
                </div>
                <div>
                    <h1 className="text-xl"> PYTANIA: </h1>
                    {questions.map((qwa, index) =>
                        <Question 
                            key={index} 
                            questionWithAnswer={qwa} 
                            asker={
                                qwa.question.asker_id ? askers.get(qwa.question.asker_id) ?? null : null
                        }/>
                    )}
                </div>
            </>
        : "Loading..."}
        </div>
    );
}