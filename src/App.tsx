import { useEffect, useState } from 'react';
import { Route, Switch } from 'wouter';
import './App.css';
import Login from './Login';
import Navbar from './Navbar';
import Profile from './Profile';
import { AppContext, SessionData } from './context';
import logo from './logo.svg';
import { apiMe, apiRefresh } from './utils/apiUtil';


function App() {
  const [context, setContext] = useState<SessionData>(
    {
      accessToken: null,
      currentUser: null
    }
  )

  useEffect(() => {
    //Try to log in the user automatically
    apiRefresh()
      .then(token => {
        if (!token) {
          //not logged in, 
          return;
        }
        apiMe({ 
          context: {...context, accessToken: token}, 
          setContext 
        })
          .then(user => {
            if (!user) {
              //user does not exist
              return;
            }

            setContext({...context, accessToken: token, currentUser: user});
          })
      })  
    .catch(() => { /* server error */ });
  }, []);

  return (
    <AppContext.Provider value={{context, setContext}}>
      <Navbar></Navbar>
      <Switch>
        <Route path="/">
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              {/* <Question ques?tion='Bla bla bla, bla bla bla, bla bla bla, bla bla bla, bla bla bla, bla bla bla, bla bla bla, bla bla bla, bla bla bla, bla bla bla, bla bla bla?' answer='mhm, śmiga ziomek'></Question> */}
            </header>
          </div>
        </Route>
        <Route path="/user/:id">
          {
            params => {
              const user = parseInt(params.id ?? "");
              return <Profile userId={user}></Profile>
            } 
          }
        </Route>
        <Route path="/login">
          <Login></Login>
        </Route>
        <Route>
          404
        </Route>
      </Switch>
    </AppContext.Provider>
  );
}

export default App;
