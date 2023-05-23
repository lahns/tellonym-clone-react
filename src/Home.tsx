import { useEffect, useState } from "react";
import { useAppContext } from "./context";
import { Question, QuestionWithAnswer } from "./types";
import { apiFollowers, apiGetUserQuestions } from "./utils/apiUtil";

const Home = () => {
  const [qwas, setqwas] = useState<QuestionWithAnswer[] | null>(null)
  const { context } = useAppContext();
  useEffect(()=>{
    if (context.currentUser != null) {
      let follows: number[] = [];
      context.following.forEach((user) => {
        follows.push(user.id);
      });
      let questions_of_following : QuestionWithAnswer[] = [];
      follows.forEach(follow => {
        if(follow != null){
          apiGetUserQuestions(follow).then(res => res && questions_of_following.push(...res))
        }
      })
      if(qwas === null)
        setqwas(questions_of_following)
      // questions_of_following.forEach(question =>{
  
      // })
    }
  })
  


  return <div>`{JSON.stringify(qwas)}`</div>;
};

export default Home;
