import { useState } from 'react';
import { Route, Switch } from 'wouter';
import './App.css';
import Login from './Login';
import Navbar from './Navbar';
import Profile from './Profile';
import { AppContext, SessionData } from './context';
import logo from './logo.svg';


function App() {
  const [context, setContext] = useState<SessionData>(
    {
      accessToken: { token: "", _marker: null },
      currentUser: null
    }
  )

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
