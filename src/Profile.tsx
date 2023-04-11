import { useEffect, useReducer, useState } from "react";
import { useLocation } from "wouter";
import Badge from "./Badge";
import Button from "./Button";
import Question from "./Question";
import Select from "./Select";
import { useAppContext } from "./context";
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

    const {context, setContext} = useAppContext();

    const [userExists, setUserExists] = useState<boolean>(true);
    const [userData, setUserData] = useState<User | null>(null);

    const [questions, setQuestions] = useState<QuestionWithAnswer[]>([]);
    const [{map: askerMap}, dispatchAskers] = useReducer(askerReducer, { map: new Map() });

    const sortingOpts = {
        "likes": "Most liked", 
        "newest": "Newest",
    } as const;
    const [sorting, setSorting] = useState<keyof typeof sortingOpts>("newest");


    const ownsProfile = context.currentUser?.user.id === userId;

    const isFollowed = false; // Todo

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
        <> 
            { userExists ?
                userData ?
                    <> 
                        <div className="w-full flex flex-col justify-center items-center">
                            <div className="w-full relative">
                                <img className="object-cover h-24 md:h-44 w-full" alt="" src={`https://picsum.photos/800`}></img>
                                <div className="w-36 md:w-44 border-white border-8 absolute rounded-full overflow-hidden md:top-1/2 top-1/4 bg-white left-0 ml-4 md:ml-0 md:left-[14%]">
                                    <img className="object-cover" alt="" src={`${config.ServerURL}/pfps/${userData.id}.png`}></img>
                                </div>
                            </div>
                            <div className="w-full md:w-3/4 flex flex-row pt-4 px-4 justify-between items-start">
                                <div className="w-auto pt-12 md:pt-20">
                                    <div className="text-text-header font-bold text-2xl truncate">{userData.username}</div>
                                    {/* <div className="text-black font-thin text-md truncate">Joined on 23/02/2022</div> */}
                                </div>
                                <div className="w-fit flex flex-col md:flex-row justify-end items-end">
                                    {
                                        ownsProfile ? 
                                        <Button.Secondary>Edit profile</Button.Secondary>   
                                        :
                                        isFollowed ? 
                                        <Button.Cancel>Unfollow</Button.Cancel>   
                                        :
                                        <Button.Primary>Follow</Button.Primary>   
                                        
                                    }

                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-3/4 flex flex-col justify-center items-start px-4 pb-4">
                            <div className="flex flex-col justify-center items-start break-words">
                                <div className="text-text-normal">{userData.bio !== "" ? `${userData.bio}` : null}</div>
                            </div>
                        </div>
                        <div className="w-full md:w-3/4 flex flex-row gap-4 justify-start items-center px-4 pb-4">
                                <Badge.Youtube label="@tester223" link="https://youtube.com/"/>
                                <Badge.Twitter label="@testerpl" link="https://twitter.com/"/>
                                <Badge.Instagram label="tester.pl" link="https://instagram.com/"/>
                                <Badge.Twitch label="testerowicz" link="https://twitch.com/"/>
                        </div>
                        <div className="w-full flex flex-row justify-evenly items-start p-4">
                            <div className="flex flex-col justify-center items-center">
                                <div className="text-text-header font-bold text-3xl">{userData.follower_count}</div>
                                <div className="font-thin text-text-secondary">Followers</div>
                            </div>
                            <div className="flex flex-col justify-center items-center">
                                <div className="text-text-header font-bold text-3xl">{userData.following_count}</div>
                                <div className="font-thin text-text-secondary">Following</div>
                            </div>
                            <div className="flex flex-col justify-center items-center">
                                <div className="text-text-header font-bold text-3xl">{/*TODO: change this later*/} 6</div>
                                <div className="font-thin text-text-secondary">Questions</div>
                            </div>
                        </div>
                        {/* <div className="p-4 self-start font-bold text-black text-xl">Ask me anything</div> */}
                        <div className="w-full md:w-3/4 gap-2 p-4 flex flex-col justify-center items-center">
                            <textarea className="w-full p-1 bg-gray-bg focus:outline-none focus:border-primary-bg border-gray-outline border-2 rounded-lg placeholder-gray-text" rows={4} placeholder="Will you come to my wedding??"/>
                            <div className="w-full flex flex-row justify-between items-center">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input defaultChecked type="checkbox" value="" className="sr-only peer"/>
                                    <div className="w-11 h-6 bg-gray-bg peer-focus:outline-none border-2 border-gray-outline peer-checked:border-primary-bg focus:border-primary-bg peer-focus:ring-2 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-outline after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-bg"></div>
                                    <span className="ml-3 text-sm text-text-secondary">Anonymous</span>
                                </label>
                                <Button.Primary>
                                    Ask
                                </Button.Primary>   
                            </div>
                        </div>
                        <div className="w-full md:w-3/4 p-4 flex flex-col justify-between items-center gap-2">
                            <div className="w-full flex flex-row justify-between items-center">
                                <div className="font-bold text-black text-xl">Questions</div>
                                <Select value={sorting} setValues={setSorting} options={sortingOpts}></Select>
                                {/* <div className="flex flex-row justify-center items-center rounded-lg">
                                    <div onClick={() => setSorting("likes")} className={`p-2 text-center rounded-l-lg border-gray-200 border-2 border-r-0 hover:bg-gray-100`}>Most liked</div>
                                    <div onClick={() => setSorting("newest")} className={`p-2 text-center rounded-r-lg bg-blue-200 text-blue-800 border-blue-300 border-2 border-l-0 hover:bg-gray-100`}>Newest</div>
                                </div> */}
                            </div>
                            <div className="w-full rounded-lg overflow-hidden">
                                {questions.map((qwa, index) =>
                                    <Question 
                                        key={index} 
                                        questionWithAnswer={qwa} 
                                        asker={
                                            qwa.question.asker_id ? askerMap.get(qwa.question.asker_id) ?? null : null
                                    }/>
                                )}
                            </div>
                        </div>
                    </>
                : "Loading..."
            : "User not found" }
        </>
    );
}

export default Profile;