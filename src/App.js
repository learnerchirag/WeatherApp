import logo from "./logo.svg";
import "./App.css";
import Search from "./components/Search";
import Weather from "./components/Weather";

function App() {
  return (
    <div className="App">
      {/* {navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
      })}
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      {/* <Search /> */}
      <Weather />
    </div>
  );
}

export default App;
