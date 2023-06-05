import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import Badge from "./Badge";
import Button from "./Button";
import Loading from "./Loading";
import Question from "./Question";
import Select from "./Select";
import Textarea from "./Textarea";
import Toggle from "./Toggle";
import { useAppContext } from "./context";
import { QuestionWithAnswer, User } from "./types";
import {
  apiAskQuestion,
  apiFollow,
  apiGetUserQuestions,
  apiUser,
} from "./utils/apiUtil";
import config from "./utils/config";
import { fetchAskedData, fetchAskerData } from "./utils/utils";

type ProfileProps = { userId: number };

const sortingOpts = {
  likes: "Most liked",
  newest: "Newest",
  oldest: "Oldest",
} as const;

type SortingType = keyof typeof sortingOpts;

const Profile = ({ userId }: ProfileProps) => {
  //Needed to refresh the page when url changes
  const [location, setLocation] = useLocation();

  const { context, setContext } = useAppContext();

  const [userExists, setUserExists] = useState<boolean>(true);
  const [userData, setUserData] = useState<User | null>(null);

  // lil hack to automatically sort questions
  const [questions, setQuestions] = useState<QuestionWithAnswer[]>([]);

  const [askedMap, setAskedMap] = useState<Map<number, User>>(new Map());
  const [askerMap, setAskerMap] = useState<Map<number, User>>(
    context.currentUser
      ? new Map([[context.currentUser.user.id, context.currentUser]])
      : new Map()
  );

  const [currentlySelectedQuestion, setCurrentlySelectedQuestion] = useState<
    number | null
  >(null);

  const [sorting, setSorting] = useState<SortingType>("newest");

  const sortQuestions = (
    questions: QuestionWithAnswer[],
    sorting: SortingType
  ): QuestionWithAnswer[] => {
    const sorted = questions.sort(
      (
        { question: { likes: likes1, asked_at: asked_at1 } },
        { question: { likes: likes2, asked_at: asked_at2 } }
      ) => {
        if (sorting === "likes") return likes2 - likes1;
        else if (sorting === "oldest") {
          const date1 = Date.parse(asked_at1);
          const date2 = Date.parse(asked_at2);

          return date2 - date1;
        } else {
          const date1 = Date.parse(asked_at1);
          const date2 = Date.parse(asked_at2);

          return date1 - date2;
        }
      }
    );

    return sorted;
  };

  useEffect(() => {
    setQuestions((oldQuestions) => sortQuestions(oldQuestions, sorting));
  }, [sorting]);

  const sampleQuestions: string[] = [
    "Will you come to my wedding?",
    "Wanna buy some melons?",
    "What secret conspiracy would you like to start?",
    "Is the cake a lie?",
    "Do you like broccoli?",
    "What are your pronouns?",
    "Will you play a game with me?",
    "What is your favourite sport?",
    "What is melon going to be smelling today?",
  ];

  const [randomSampleQuestion] = useState(
    sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)]
  );

  const ownsProfile = context.currentUser?.user.id === userId;

  useEffect(() => {
    setUserData(null);
    setUserExists(true);
    window.scrollTo(0, 0);

    // Fetch user data for the profile owner
    apiUser(userId).then((data) => {
      if (!data) {
        // User does not exist
        setUserExists(false);
      } else {
        setUserData(data);
        document.title = `${data.username}'s profile`;
      }
    });

    apiGetUserQuestions(userId).then((data) => {
      if (!data) return;

      fetchAskerData(data).then((map) => setAskerMap(map));
      fetchAskedData(data).then((map) => setAskedMap(map));

      const sortedQuestions = sortQuestions(data, "newest");
      setQuestions(sortedQuestions);
    });
  }, [location, userId]);

  const unfollowUser = () => {
    if (context.currentUser && userData) {
      const newFollowing = context.following.filter(
        (user) => user.id !== userId
      );
      setContext({ ...context, following: newFollowing });
      apiFollow(userId, { context, setContext }).catch(() => {
        // show some kind of error, maybe change the button back
      });
    }
  };

  const followUser = () => {
    if (context.currentUser && userData) {
      context.following.push(userData);
      setContext({ ...context });
      apiFollow(userId, { context, setContext }).then(() => {
        // show some kind of error maybe change the button back
      });
    }
  };

  const anonCheckbox = useRef<HTMLInputElement>(null);
  const questionBox = useRef<HTMLTextAreaElement>(null);


  
  const askQuestion = () => {
    if (
      context.currentUser &&
      userData &&
      anonCheckbox.current &&
      questionBox.current
    ) {
      const questionContent = questionBox.current.value.trim();
      const anon = anonCheckbox.current.checked;
      if (questionContent.length < 10) return; //todo: display some error
      apiAskQuestion({ anonymous: anon, content: questionContent }, userId, {
        context,
        setContext,
      }).then(() => {
        setQuestions(
          sortQuestions(
            [
              ...questions,
              {
                question: {
                  id: 0,
                  content: questionContent,
                  likes: 0,
                  asked_id: userId,
                  asker_id: anon ? null : context.currentUser!.user.id,
                  asked_at: new Date(Date.now()).toISOString(),
                },
                answer: null,
              },
            ],
            sorting
          )
        );
        if (questionBox.current) questionBox.current.value = "";
      });
    }
  };

  return (
    <>
      {userExists ? (
        userData ? (
          <>
            <div className="w-full flex flex-col justify-center items-center">
              <div className="w-full relative">
                <img
                  className="object-cover h-24 md:h-44 w-full"
                  alt=""
                  src={`${config.ServerURL}/bgs/${userData.id}.png`}
                ></img>
                <div className="w-36 md:w-44 md:h-44 h-36 flex justify-center items-center border-white border-8 absolute rounded-full overflow-hidden md:top-1/2 top-1/4 bg-white left-0 ml-4 md:ml-0 md:left-[14%]">
                  <img
                    className="w-36 md:w-44 h-36 md:h-44"
                    alt=""
                    src={`${config.ServerURL}/pfps/${userData.id}.png`}
                  ></img>
                </div>
              </div>
              <div className="w-full md:w-3/4 flex flex-row pt-4 px-4 justify-between items-start">
                <div className="w-auto pt-12 md:pt-20">
                  <div className="text-text-header font-bold text-2xl truncate">
                    {userData.username}
                  </div>
                  {/* <div className="text-black font-thin text-md truncate">Joined on 23/02/2022</div> */}
                </div>
                <div className="w-fit flex flex-col md:flex-row justify-end items-end">
                  {ownsProfile ? (
                    <Button.Secondary onClick={() => setLocation("/settings")}>
                      Edit profile
                    </Button.Secondary>
                  ) : context.following?.some(({ id }) => userId === id) ? (
                    <Button.Cancel onClick={unfollowUser}>
                      Unfollow
                    </Button.Cancel>
                  ) : (
                    <Button.Primary onClick={followUser}>Follow</Button.Primary>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full md:w-3/4 flex flex-col justify-center items-start px-4 pb-4">
              <div className="flex flex-col justify-center items-start break-words">
                <div className="text-text-normal">
                  {userData.bio !== "" ? `${userData.bio}` : null}
                </div>
              </div>
            </div>
            <div className="w-full md:w-3/4 flex flex-row gap-4 justify-start items-center px-4 pb-4">
              {userData.youtube ? (
                <Badge.Youtube
                  label={`@${userData.youtube}`}
                  link={`https://youtube.com/@${userData.youtube}`}
                />
              ) : null}
              {userData.twitter ? (
                <Badge.Twitter
                  label={`@${userData.twitter}`}
                  link={`https://twitter.com/${userData.twitter}`}
                />
              ) : null}
              {userData.instagram ? (
                <Badge.Instagram
                  label={userData.instagram}
                  link={`https://instagram.com/${userData.instagram}`}
                />
              ) : null}
              {userData.twitch ? (
                <Badge.Twitch
                  label={userData.twitch}
                  link={`https://twitch.com/${userData.twitch}`}
                />
              ) : null}
            </div>
            <div className="w-full flex flex-row justify-evenly items-start p-4">
              <div className="flex flex-col justify-center items-center">
                <div className="text-text-header font-bold text-3xl">
                  {userData.follower_count}
                </div>
                <div className="font-thin text-text-secondary">Followers</div>
              </div>
              <div className="flex flex-col justify-center items-center">
                <div className="text-text-header font-bold text-3xl">
                  {userData.following_count}
                </div>
                <div className="font-thin text-text-secondary">Following</div>
              </div>
              <div className="flex flex-col justify-center items-center">
                <div className="text-text-header font-bold text-3xl">
                  {questions.length}
                </div>
                <div className="font-thin text-text-secondary">Questions</div>
              </div>
            </div>
            {/* <div className="p-4 self-start font-bold text-black text-xl">Ask me anything</div> */}
            <div className="w-full md:w-3/4 gap-2 p-4 flex flex-col justify-center items-center">
              <Textarea
                ref={questionBox}
                disabled={!context.currentUser || ownsProfile}
                placeholder={randomSampleQuestion}
              />
              <div className="w-full flex flex-row justify-between items-center">
                <Toggle
                  defaultChecked
                  disabled={!context.currentUser || ownsProfile}
                  ref={anonCheckbox}
                >
                  Anonymous
                </Toggle>
                <Button.Primary
                  disabled={!context.currentUser || ownsProfile}
                  onClick={askQuestion}
                >
                  Ask
                </Button.Primary>
              </div>
            </div>
            <div className="w-full md:w-3/4 p-4 flex flex-col justify-between items-center gap-2">
              <div className="w-full flex flex-row justify-between items-center">
                <div className="font-bold text-black text-xl">Questions</div>
                <Select
                  value={sorting}
                  setValues={setSorting}
                  options={sortingOpts}
                ></Select>
              </div>
              <div className="w-full rounded-md overflow-hidden  divide-y-2 divide-gray-outline">
                {questions.length === 0 ? (
                  <div className="text-gray-outline text-3xl font-bold text-center">
                    No questions yet
                  </div>
                ) : (
                  questions.map((qwa, index) => (
                    <Question
                      key={index}
                      questionWithAnswer={qwa}
                      asker={
                        qwa.question.asker_id
                          ? askerMap.get(qwa.question.asker_id) ?? null
                          : null
                      }
                      asked={
                        //kms
                        askedMap.get(qwa.question.asked_id) ?? {
                          username: "Deleted user",
                          bio: "",
                          id: -1,
                          follower_count: 0,
                          following_count: 0,
                          instagram: "",
                          twitch: "",
                          twitter: "",
                          youtube: "",
                        }
                      }
                      setSelected={() =>
                        currentlySelectedQuestion === index
                          ? setCurrentlySelectedQuestion(null)
                          : setCurrentlySelectedQuestion(index)
                      }
                      selected={currentlySelectedQuestion == index}
                      position={
                        index == 0
                          ? "first"
                          : index == questions.length - 1
                          ? "last"
                          : null
                      }
                      showAsked={false}
                      setQuestion={(func: (qwa: QuestionWithAnswer) => QuestionWithAnswer) => {
                        setQuestions((old) =>
                            sortQuestions([
                              ...old!.filter((qwa2) => qwa2.question.id !== qwa.question.id), 
                              ...old!.filter((qwa2) => qwa2.question.id === qwa.question.id).map((qwa) => func(qwa))
                            ], sorting)
                          )
                        }
                      }
                    />
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          <Loading />
        )
      ) : (
        "User not found"
      )}
    </>
  );
};

export default Profile;
