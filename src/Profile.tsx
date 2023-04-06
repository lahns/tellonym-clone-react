import { useEffect, useReducer, useState } from "react";
import { useLocation } from "wouter";
import Question from "./Question";
import { QuestionWithAnswer, User } from "./types";
import { apiGetUserQuestions, apiUser } from "./utils/apiUtil";
import config from "./utils/config";

type ProfileProps = { userId: number };

const askerReducer = ({map}: { map: Map<number, User> }, {id, userData}: { id: number, userData: User }) => {
    map.set(id, userData);
    return { map };
}

const Profile = ({userId}: ProfileProps) => {
    //Needed to refresh the page when url changes
    const [location,] = useLocation();

    const [userExists, setUserExists] = useState<boolean>(true);
    const [userData, setUserData] = useState<User | null>(null);

    const [questions, setQuestions] = useState<QuestionWithAnswer[]>([]);
    const [{map: askerMap}, dispatchAskers] = useReducer(askerReducer, { map: new Map() });

    // const context = useContext(AppContext);
    // const userLikes = context.currentUser?.likes;


    useEffect(() => {
        // Fetch user data for the profile owner
        apiUser(userId).then((data) => {
            if (!data) { // User does not exist
                setUserExists(false);
            } else {                
                setUserData(data)
            }
        });

        // Fetch questions for the profile user
        apiGetUserQuestions(userId).then((data) => {
            if (!data) return; // User does not exist, dont load the questions

            const askerIds = data
                .filter(data => data.question.asker_id != null)
                .map(data => data.question.asker_id!);

            askerIds.forEach(id => {
                apiUser(id).then(userData => {
                    if (!userData) return; // User does not exist, just display as anon
                    
                    dispatchAskers({ id, userData }); 
                });

            });
            
            setQuestions(data);
        });
    }, [location, userId]);

    return (
        <div>{userExists ?
            userData ?  
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
                                    qwa.question.asker_id ? askerMap.get(qwa.question.asker_id) ?? null : null
                            }/>
                        )}
                    </div>
                </>
            : "Loading..."
        : "User not found"}
        </div>
    );
}

export default Profile;