import { useEffect, useReducer, useRef, useState } from "react";
import { useLocation } from "wouter";
import Badge from "./Badge";
import Button from "./Button";
import Loading from "./Loading";
import Question from "./Question";
import Textarea from "./Textarea";
import Toggle from "./Toggle";
import { useAppContext } from "./context";
import { QuestionWithAnswer, User } from "./types";
import { apiAskQuestion, apiFollow, apiGetUserQuestions, apiUser } from "./utils/apiUtil";
import config from "./utils/config";
import Select from "./Select";

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

    const Quotes : string[]= [
        "Will you come to my wedding?",
        "Wanna buy some melons?",
        "What secret conspiracy would you like to start?",
        "Is cake a lie?",
        "Do you like broccoli?",
        "What are your pronouns?",
        "Will you play a game with me?",
        "What is your favourite sport?",
    ];
    


    const [randomQuote, setQuote] = useState("");



    const ownsProfile = context.currentUser?.user.id === userId;

    const isFollowed = userData ? context.following?.some(({id}) => userId) : false; // Todo

    useEffect(() => {
        setQuote(Quotes[Math.floor(Math.random()*Quotes.length)]);
        setUserData(null);
        setUserExists(true);
        window.scrollTo(0, 0);

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

    const unfollowUser = () => {
        if (context.currentUser && userData) {
            const newFollowing = context.following.filter(user => user.id !== userId);
            setContext({...context, following: newFollowing});
            apiFollow(userId, { context, setContext }).catch(() => {
                // show some kind of error, maybe change the button back
            });
        }
    }

    const followUser = () => {
        if (context.currentUser && userData) {
            context.following.push(userData);
            setContext({ ...context });
            apiFollow(userId, { context, setContext }).then(() => {
                // show some kind of error maybe change the button back
            });
        } 
    }

    const anonCheckbox = useRef<HTMLInputElement>(null);
    const questionBox = useRef<HTMLTextAreaElement>(null);

    const askQuestion = () => {
        if (context.currentUser && userData && anonCheckbox.current && questionBox.current) {
            const questionContent = questionBox.current.value.trim();
            const anon = anonCheckbox.current.checked;
            if (questionContent.length < 10) return //todo: display some error
            apiAskQuestion(
                { anonymous: anon, content: questionContent }, 
                userId, 
                {context, setContext}
            ).then(() => {
                setQuestions([
                    ...questions, 
                    {
                        question: {
                            id: 0,
                            content: questionContent,
                            likes: 0,
                            asked_id: userId,
                            asker_id: anon ? null : context.currentUser!.user.id,
                            asked_at: "now"
                        },
                        answer: null
                    }
                ])
            });
        }
    }

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
                                        <Button.Cancel onClick={unfollowUser}>Unfollow</Button.Cancel>   
                                        :
                                        <Button.Primary onClick={followUser}>Follow</Button.Primary>   
                                        
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
                            <Textarea ref={questionBox} disabled={!context.currentUser || ownsProfile} placeholder={randomQuote}/> 
                            <div className="w-full flex flex-row justify-between items-center">
                                <Toggle defaultChecked disabled={!context.currentUser || ownsProfile} ref={anonCheckbox}>
                                    Anonymous
                                </Toggle>
                                <Button.Primary disabled={!context.currentUser || ownsProfile} onClick={askQuestion}>
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
                : <Loading/>
            : "User not found" }
        </>
    );
}

export default Profile;