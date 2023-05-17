import { useEffect, useState } from 'react';
import { Route, Switch } from 'wouter';
import './App.css';
import Home from './Home';
import Login from './Login';
import Navbar from './Navbar';
import Profile from './Profile';
import { AppContext, SessionData } from './context';
import { apiRefresh } from './utils/apiUtil';
import { login } from './utils/utils';
import Register from './Register';

const App = () => {
  const [context, setContext] = useState<SessionData>(
    {
      accessToken: null,
      currentUser: null,
      following: []
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
        login({context: { ...context, accessToken: token}, setContext});
      })  
    .catch(() => { /* server error */ });
  });

  return (
    <AppContext.Provider value={{context, setContext}}>
      <Navbar></Navbar>
      <div className='bg-gray-100 lg:p-5 w-full min-h-screen flex justify-center'>
        <div className="flex flex-col items-center lg:rounded-lg overflow-hidden bg-white w-full h-fit lg:h-fit lg:w-2/3 xl:w-1/2 xl:min-w-[700px] drop-shadow-md">
          <Switch>
            <Route path="/">
              <Home></Home>
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
            <Route path="/register">
              <Register></Register>
            </Route>
            <Route>
              404
            </Route>
          </Switch>
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
