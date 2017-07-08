import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './options.css'

interface UserPrefs {
  favoriteColor: string,
  colorful: boolean,
}

class Options extends React.Component<{}, { prefs: UserPrefs }> {

  private handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({
      prefs: {
        favoriteColor: e.target.value,
        colorful: this.state.prefs.colorful,
      }
    })
  }

  private handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      prefs: {
        favoriteColor: this.state.prefs.favoriteColor,
        colorful: e.target.checked,
      }
    })
  }

  private handleSaveClick = () => {
    // save options
    chrome.storage.sync.set(this.state.prefs, () => {
      // notify user that settings are saved
      console.log('options saved', this.state.prefs);
    });
  }

  constructor(props) {
    super(props);
    // init state with default values
    this.state = {
      prefs: {
        favoriteColor: 'red',
        colorful: false,
      }
    }
  }

  public componentWillMount() {
    // read options from storage, with default values
    chrome.storage.sync.get(['favoriteColor', 'colorful'], (items: UserPrefs) => {
      this.setState({ prefs: items });
      console.log('options loaded', items);
    });
  }

  public render() {
    return (
      <div>
        <label>Favorite color</label>
        <select onChange={this.handleSelectChange} value={this.state.prefs.favoriteColor}>
          <option value='red'>Red</option>
          <option value='green'>Green</option>
          <option value='blue'>Blue</option>
          <option value='yellow'>Yellow</option>
        </select>

        <label>Colorful background</label>
        <input type='checkbox' checked={this.state.prefs.colorful} onChange={this.handleCheckboxChange} />

        <button onClick={this.handleSaveClick}>Save</button>

      </div>
    );
  }
}

ReactDOM.render(
  <Options />,
  document.getElementById('root') as HTMLElement
);
