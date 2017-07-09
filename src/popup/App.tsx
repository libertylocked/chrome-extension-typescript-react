import * as React from "react";
import "./App.css";

import * as logo from "./logo.svg";

class App extends React.Component<{}, {}> {
  public render() {
    const formattedTime: string = new Date().toString();

    return (
      <div className="App-container">
        <h1 className="App-title">My Awesome Chrome Extension</h1>
        <img src={logo} className="App-logo" alt="logo" />
        <span>React + TypeScript!</span>
        <p>{formattedTime}</p>
        <ul>
          <li>Right click and select <strong>Inspect</strong> to open DevTools</li>
          <li>In DevTools, press Ctrl+R to reload</li>
        </ul>
      </div>
    );
  }
}

export default App;
