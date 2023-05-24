import { useEffect, useState } from "react";
import Question from "./Question";
import { useAppContext } from "./context";
import { QuestionWithAnswer, User } from "./types";
import { apiGetUserQuestions } from "./utils/apiUtil";
import { fetchAskerData } from "./utils/utils";

const Home = () => {
  const [qwas, setqwas] = useState<QuestionWithAnswer[] | null>(null);
  const { context } = useAppContext();

  const [askerMap, setAskerMap] = useState<Map<number, User>>(new Map())


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
          setqwas(questions_of_following);
          fetchAskerData(questions_of_following).then(map => setAskerMap(map));
        } 

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
