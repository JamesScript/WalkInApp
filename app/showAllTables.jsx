// Dependencies
const React = require('react');
const axios = require('axios');

// Modules
const SingleRestaurantSegment = require('./singleRestaurantSegment');

// Show All Tables - displays everything in real-time on the MainSection component
class ShowAllTables extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tables: []
    }
    this.listAllTables = this.listAllTables.bind(this);
    this.listAllTables();
    // Listens out for 'io.emit' from server for real-time updates
    socket.on('update tables', () => {
      this.listAllTables() 
    });
  }
  
  // List all tables and store data in state
  listAllTables() {
    axios.get('/listAllTables')
    .then(res => {
      this.setState({tables: res.data});
    });
  }
  
  // Show tables - filter according to search query if there is one
  showTableList() {
    let tableArr = [];
    for (let i = 0; i < this.state.tables.length; i++) {
      const regex = new RegExp(this.props.searchQuery, 'i');
      if (this.props.searchQuery.length === 0 || regex.test(this.state.tables[i].restaurant)) {
        tableArr.push(<SingleRestaurantSegment tableData={this.state.tables[i]}/>);
      }
    }
    return tableArr;
  }
  
  render() {
    return(
      <div>
        <div>
          {this.showTableList()}
        </div>
      </div>
    );
  }
}

module.exports = ShowAllTables;