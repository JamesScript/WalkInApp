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
    socket.on('update tables', () => {
      this.listAllTables() 
    });
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
      // console.log(this.props.searchQuery);
      const regex = new RegExp(this.props.searchQuery, 'i');
      // console.log(this.state.tables[i].restaurant);
      // console.log(regex.test(this.state.tables[i].restaurant));
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