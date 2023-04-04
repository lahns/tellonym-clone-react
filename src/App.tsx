import { Route, Switch } from 'wouter';
import './App.css';
import Navbar from './Navbar';
import Profile from './Profile';
import logo from './logo.svg';

function App() {
  return (
    <>
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
      <Route>
        404
      </Route>
    </Switch>
    </>
  );
}

export default App;
