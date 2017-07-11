import * as React from "react";

const appStyles = require("./App.css");
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
      <div className={appStyles.app}>
        <div className={appStyles.appHeader}>
          <img src={logo} className={appStyles.appLogo} alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className={appStyles.appIntro}>
          To get started, edit <code>src/popup/App.tsx</code>
        </p>
        <p>
          Right click and select <strong>Inspect</strong> to open DevTools.
          In DevTools, press <code>Ctrl+R</code> to reload
        </p>
        <hr />
        <p>Rendered at {formattedTime}</p>
      </div>
    );
  }
}

export default App;
