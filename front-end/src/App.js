import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import { Dropdown } from './components/dropdown';
import { Row } from './components/row';

const serverURL = 'http://localhost:3000'
class App extends Component {
  constructor() {
    super();
    this.state = {
      listVariables: [], datas: [], unavailableStats: [], loadingState: false
    };

    this.getVariables();
    this.getData = this.getData.bind(this);
  }
  componentDidMount() {
    this.getVariables();
  }
  render() {
    return (
        <div className="App">
          <div class="table-title">
              <h3>US Census</h3>
              <h5>Gabrielle Rappaport</h5>
              <Dropdown list={this.state.listVariables} loadingState={this.state.loadingState} handleChange={this.getData} />
          </div>
          <p>
              Number of unconsidered values : {this.state.unavailableStats.undisplayedValues}
          </p>
          <p>
              Number of people concerned by those values : {this.state.unavailableStats.undisplayedLines}
          </p>
          <table class="table-fill">
              <thead>
                  <tr>
                      <th class="text-left">Values</th>
                      <th class="text-left">Count</th>
                      <th class="text-left">Average Age</th>
                  </tr>
              </thead>
              <tbody class="table-hover">
                  {this.state.datas.map((row) => (<Row key={row.value} data={row} />))}
              </tbody>
          </table>
        </div>
    );
  }

  async getVariables() {
    this.setState({ loadingState: true });
    await axios.get(`${serverURL}/`)
      .then((response) => {
        this.setState({ listVariables: response.data.variable, loadingState: false });
      })
      .catch((error) => {
        console.log('Error fetching and parsing variables', error);
      });
  }

  async getData(variable) {
    this.setState({ loadingState: true });

    await axios.get(`${serverURL}/data`,
        {
            params: {
                "variable" : variable
            }
        })
      .then((response) => {
        this.setState({ datas: response.data, loadingState: false });
      })
      .catch((error) => {
        console.log('Error fetching and parsing statistics', error);
      });

      await axios.get(`${serverURL}/unvailable`,
          {
              params: {
                  "variable" : variable
              }
          })
        .then((response) => {
          this.setState({ unavailableStats: response.data[0], loadingState: false });
        })
        .catch((error) => {
          console.log('Error fetching and parsing statistics', error);
        });
  }
}
export default App;
