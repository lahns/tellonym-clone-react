import { Route } from 'wouter';
import './App.css';
import Navbar from './Navbar';
import { Question } from './Question';
import logo from './logo.svg';

function App() {
  return (
    <>
    <Navbar></Navbar>
    <Route path="/">
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <Question question='Bla bla bla, bla bla bla, bla bla bla, bla bla bla, bla bla bla, bla bla bla, bla bla bla, bla bla bla, bla bla bla, bla bla bla, bla bla bla?' answer='mhm, śmiga ziomek'></Question>
        </header>
      </div>
    </Route>
    <Route path="/test">
      <div>test route</div>
    </Route>
    </>
  );
}

export default App;
