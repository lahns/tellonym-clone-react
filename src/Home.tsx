import { useEffect, useState } from "react";
import Question from "./Question";
import { useAppContext } from "./context";
import { QuestionWithAnswer, User } from "./types";
import { apiGetUserQuestions } from "./utils/apiUtil";
import { fetchAskedData, fetchAskerData } from "./utils/utils";

const Home = () => {
  const [qwas, setqwas] = useState<QuestionWithAnswer[] | null>(null);
  const { context } = useAppContext();

  const [askerMap, setAskerMap] = useState<Map<number, User>>(new Map())
  const [askedMap, setAskedMap] = useState<Map<number, User>>(new Map())

  const sortQuestions = (
    questions: QuestionWithAnswer[],
  ): QuestionWithAnswer[] => {
    const sorted = questions.sort(
      (
        { question: { likes: likes1, asked_at: asked_at1 } },
        { question: { likes: likes2, asked_at: asked_at2 } }
      ) => {
          const date1 = Date.parse(asked_at1);
          const date2 = Date.parse(asked_at2);

          return date1 - date2;
      }
    );

    return sorted;
  };


  useEffect(() => {
    document.title = "Home";
    (async () => {
      if (context.currentUser != null) {
        let follows: number[] = [];
        context.following.forEach((user) => {
          follows.push(user.id);
        });
        let questions_of_following: QuestionWithAnswer[] = [];

        for (const follow of follows) {
          if (follow != null) {
            await apiGetUserQuestions(follow).then(
              (res) => res && questions_of_following.push(...res)
            );
          }
        }

        if (qwas === null) {
          setqwas(sortQuestions(questions_of_following));
          fetchAskerData(questions_of_following).then(map => setAskerMap(map));
          fetchAskedData(questions_of_following).then(map => setAskedMap(map));
        } 
      }
    })();
  }, [context.currentUser]);

  return (
    <div className="w-full overflow-hidden divide-y-2 divide-gray-outline rounded-lg">
                {
                  qwas?.length === 0 ?
                    <div className="text-gray-outline text-3xl font-bold text-center">
                      No questions yet
                    </div>
                  :
                  qwas?.map((qwa, index) => (
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
                        askedMap.get(qwa.question.asked_id) ?? { username: "Deleted user", bio: "", id: -1, follower_count: 0, following_count: 0, instagram: "", twitch: "", twitter: "", youtube: ""}
                      }
                      // no answering questions on homepage
                      selected={false}
                      setSelected={() => {}}
                      position={
                        index == 0 ? 'first' : (index == qwas.length-1 ? 'last' : null)
                      }
                      showAsked={true}
                      setQuestion={(func: (qwa: QuestionWithAnswer) => QuestionWithAnswer) => {
                        setqwas((old) =>
                            sortQuestions([
                              ...old!.filter((qwa2) => qwa2.question.id !== qwa.question.id), 
                              ...old!.filter((qwa2) => qwa2.question.id === qwa.question.id).map((qwa) => func(qwa))
                            ])
                          )
                        }
                      }
                    />
                  ))
                }
              </div>
            )
  };

export default Home;
