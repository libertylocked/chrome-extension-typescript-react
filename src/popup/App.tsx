import * as React from "react";
import "./App.css";

const logo = require("./logo.svg");

class App extends React.Component<{}, {}> {
  public render() {
    const formattedTime: string = new Date().toLocaleTimeString("en-us", {
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      month: "numeric",
      second: "2-digit",
      year: "numeric",
    });

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/popup/App.js</code>
        </p>
        <p className="App-intro">
          Right click and select <strong>Inspect</strong> to open DevTools.
          In DevTools, press <code>Ctrl+R</code> to reload
        </p>
        <p>Rendered at {formattedTime}</p>
      </div>
    );
  }
}

export default App;
