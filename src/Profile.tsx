import { useEffect, useReducer, useState } from "react";
import { useLocation } from "wouter";
import Question from "./Question";
import Select from "./Select";
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

    const sortingOpts = {
        "likes": "Most liked", 
        "newest": "Newest",
    } as const;
    const [sorting, setSorting] = useState<keyof typeof sortingOpts>("newest");


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
        <div className="flex flex-col items-center md:rounded-lg overflow-hidden bg-white w-full h-screen lg:h-fit lg:w-2/3 xl:w-1/2 drop-shadow-md">
            { userExists ?
                userData ?
                    <> 
                        <div className="w-full relative">
                            <img className="object-cover h-24 md:h-44 w-full" alt="" src={`https://picsum.photos/800`}></img>
                            <div className="w-36 md:w-44 border-white border-8 absolute rounded-full overflow-hidden top-1/3 bg-white left-0 ml-4">
                                <img className="object-cover" alt="" src={`${config.ServerURL}/pfps/${userData.id}.png`}></img>
                            </div>
                            <div className="flex flex-row justify-end pt-4 px-4">
                                <div className="bg-blue-300 h-fit p-2 pl-4 pr-4 rounded-lg text-white">
                                    Follow
                                </div>        
                            </div>
                        </div>
                        <div className="w-full flex flex-col justify-center items-start px-4 pb-4 pt-10 md:pt-4">
                            <div className="text-black font-bold text-3xl truncate">{userData.username}</div>
                            <div className="flex flex-col justify-center items-start break-words">
                                <div className="">{userData.bio !== "" ? `${userData.bio}` : null}</div>
                            </div>
                        </div>
                        <div className="w-full flex flex-row justify-evenly items-start p-4">
                            <div className="flex flex-col justify-center items-center">
                                <div className="text-black font-bold text-3xl">{userData.follower_count}</div>
                                <div>Followers</div>
                            </div>
                            <div className="flex flex-col justify-center items-center">
                                <div className="text-black font-bold text-3xl">{userData.following_count}</div>
                                <div>Following</div>
                            </div>
                            <div className="flex flex-col justify-center items-center">
                                <div className="text-black font-bold text-3xl">{/*TODO: change this later*/} 6</div>
                                <div>Questions</div>
                            </div>
                        </div>
                        {/* <div className="p-4 self-start font-bold text-black text-xl">Ask me anything</div> */}
                        <div className="w-full md:w-3/4 gap-2 p-4 flex flex-col justify-center items-center">
                            <textarea className="w-full p-1 bg-gray-100 focus:outline-none focus:border-blue-300 border-gray-200 border-2 rounded-lg" rows={4} placeholder="Will you come to my wedding??"/>
                            <div className="w-full flex flex-row justify-between items-center">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" value="" className="sr-only peer"/>
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none focus:border-blue-300 peer-focus:ring-4 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-300"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-900">Anonymous</span>
                                </label>
                                <div className="bg-blue-300 h-fit p-2 pl-4 pr-4 rounded-lg text-white self-end">
                                    Send
                                </div>   
                            </div>
                        </div>
                        <div className="w-full p-4 flex flex-col justify-between items-center gap-2">
                            <div className="w-full flex flex-row justify-between items-center">
                                <div className="font-bold text-black text-xl">Questions</div>
                                <Select value={sorting} setValues={setSorting} options={sortingOpts}></Select>
                                {/* <div className="flex flex-row justify-center items-center rounded-lg">
                                    <div onClick={() => setSorting("likes")} className={`p-2 text-center rounded-l-lg border-gray-200 border-2 border-r-0 hover:bg-gray-100`}>Most liked</div>
                                    <div onClick={() => setSorting("newest")} className={`p-2 text-center rounded-r-lg bg-blue-200 text-blue-800 border-blue-300 border-2 border-l-0 hover:bg-gray-100`}>Newest</div>
                                </div> */}
                            </div>
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
            : "User not found" }
        </div>
    );
}

export default Profile;