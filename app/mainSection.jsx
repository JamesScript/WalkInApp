const React = require('react');
const axios = require('axios');

const ShowAllTables = require('./showAllTables');

class MainSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: ""
    }
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange() {
    const getVal = id => document.getElementById(id).value;
    this.setState({searchQuery: getVal('searchBar')});
  }
  
  render() {
    return(
      <div id="mainSection">
        <h1 id="appName">WalkIn App</h1>
        <h2>The Restaurant Virtual-Queuing App of the Future</h2>
        <p className="description">We all know that the worst letter of the alphabet lies between P and R. That's why we've decided it's about
        time we utilised our beloved technology to make sure you don't waste any precious time when it's time to feast.</p>
        <h2>Search Restaurant</h2>
        <h3>Start typing the name of your desired restaurant to see availability at a glance.</h3>      
        <input onChange={this.handleChange} type="text" id="searchBar"></input>
        <ShowAllTables searchQuery={this.state.searchQuery}/>
      </div>
    );
  }
}

module.exports = MainSection;