import { useEffect, useState } from "react";
import { useAppContext } from "./context";
import { Question, QuestionWithAnswer } from "./types";
import { apiFollowers, apiGetUserQuestions } from "./utils/apiUtil";

const Home = () => {
  const [qwas, setqwas] = useState<QuestionWithAnswer[] | null>(null);
  const { context } = useAppContext();
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
    <div>
      {qwas?.length === 0 ? (
        <div>
          <h1>Nothing here yet.</h1>
        </div>
      ) : (
        <div>{JSON.stringify(qwas)}</div>
      )}
    </div>
  );
};

export default Home;
