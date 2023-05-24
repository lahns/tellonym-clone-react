import { useEffect, useReducer, useState } from "react";
import { useAppContext } from "./context";
import {QuestionWithAnswer, User } from "./types";
import { apiFollowers, apiGetUserQuestions } from "./utils/apiUtil";
import Question from "./Question";

const Home = () => {
  const [qwas, setqwas] = useState<QuestionWithAnswer[] | null>(null);
  const { context } = useAppContext();

  const askerReducer = (
    { map }: { map: Map<number, User> },
    { id, userData }: { id: number; userData: User }
  ) => {
    map.set(id, userData);
    return { map };
  };

  const [{ map: askerMap }, dispatchAskers] = useReducer(askerReducer, {
    map: new Map(),
  });


  useEffect(() => {
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

        if (qwas === null) setqwas(questions_of_following);
        console.log(qwas);
      }
    })();
  }, [context.currentUser]);

  return (
    <div className="w-full rounded-lg overflow-hidden">
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
                    />
                  ))
                }
              </div>
            )
  };

export default Home;
