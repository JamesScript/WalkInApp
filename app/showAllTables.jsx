const React = require('react');
const axios = require('axios');

const SingleRestaurantSegment = require('./singleRestaurantSegment');

class ShowAllTables extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tables: []
    }
    this.listAllTables = this.listAllTables.bind(this);
    this.listAllTables();
  }
  
  listAllTables() {
    axios.get('/listAllTables')
    .then(res => {
      this.setState({tables: res.data});
    });
  }
  
  showTableList() {
    let tableArr = [];
    for (let i = 0; i < this.state.tables.length; i++) {
      tableArr.push(<SingleRestaurantSegment tableData={this.state.tables[i]}/>);
    }
    return tableArr;
  }
  
  render() {
    return(
      <div>
        <h1>{this.props.searchQuery}</h1>
        <div>
          {this.showTableList()}
        </div>
      </div>
    );
  }
}

module.exports = ShowAllTables;