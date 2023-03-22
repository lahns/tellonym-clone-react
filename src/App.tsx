import { Route } from 'wouter';
import './App.css';
import Navbar from './Navbar';
import logo from './logo.svg';
import Profile from './Profile';

function App() {
  return (
    <>
    <Navbar></Navbar>
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
    </>
  );
}

export default App;
