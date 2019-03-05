// Dependencies
const React = require('react');
const axios = require('axios');

// Each restaurant on the main page - contains the tables and some statistics
class SingleRestaurantSegment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showingAllTables: false,
      loggedIn: false
    }
    this.checkIfLoggedIn = this.checkIfLoggedIn.bind(this);
    this.checkIfLoggedIn();
  }
  
  // Check if logged in and update state - determines whether user can see the rate-table inputs
  checkIfLoggedIn() {
    axios.get('/amILoggedIn')
    .then(res => {
      this.setState({loggedIn: res.data});
    });
  }
  
  // Submit rating of a table
  submitRating(tableName) {
    const restaurant = this.props.tableData.restaurant;
    const _id = this.props.tableData.shortid;
    const rating = document.getElementById("ratingTable_"+tableName+"_"+_id).value;
    const postObject = {
      restaurant: restaurant,
      rating: rating,
      tableName: tableName
    }
    axios.post('/rateTable', postObject)
    .then(res => {
      alert(res.data);
      // update everyone's state in real-time
      socket.emit('update tables');
    });
  }
  
  // Render rate table section if user is logged in
  rateTableSection(currentTable, _id) {
    return(
      <div>
        <label>Rating: </label>
        <input id={"ratingTable_"+currentTable.numberOrName+"_"+_id} type="number" min="0" max="5"></input>
        <button onClick={() => { this.submitRating(currentTable.numberOrName)}}>Rate Table</button>
      </div>
    );
  }
  
  // Show the tables that belong to this restaurant
  showTables() {
    let tableArr = [];
    const tablesLength = this.props.tableData.tables.length;
    // Show up to 3 unless user chooses to see them all
    let limiter = this.state.showingAllTables || tablesLength < 3 ? tablesLength : 3;
    const restaurant = this.props.tableData.restaurant;
    const _id = this.props.tableData.shortid;
    for (let i = 0; i < limiter; i++) {
      const currentTable = this.props.tableData.tables[i];
      let avgRatingStr = "None";
      // Work out average rating (mean) to one decimal place if there is one or more ratings
      if (currentTable.ratings.length > 0) {
        const ratingsNums = currentTable.ratings.map(rating => rating.rating*1);
        const averageRating = ratingsNums.reduce((a, b) => a + b) / ratingsNums.length;
        avgRatingStr = Math.floor(averageRating) === averageRating ? averageRating.toString() : averageRating.toFixed(1);
      }
      // Push JSX to array
      tableArr.push(
        <div className="tableInfo">
          <p>{currentTable.numberOrName}</p>
          <p>{currentTable.available ? "Available" : "Unavailable"}</p>
          <p>Average Rating: {avgRatingStr}</p>
          {this.state.loggedIn ? this.rateTableSection(currentTable, _id) : ""}
        </div>
      );
    }
    return tableArr;
  }
  
  // Statistics on table availability
  statistics() {
    let availableTables = 0;
    for (let i = 0; i < this.props.tableData.tables.length; i++) {
      if (this.props.tableData.tables[i].available) { availableTables++; }
    }
    return(
      <div>
        <p>Table Availability: {availableTables} / {this.props.tableData.tables.length}</p>
      </div>
    );
  }
  
  // Hide tables option
  hideTablesToggle() {
    return(
      <div>
        <p className="showAllTablesText" onClick={() => { this.setState({showingAllTables: false}) }}>&#9650; Hide Most Tables &#9650;</p>
      </div>
    );
  }
  
  // Show all tables option
  showAllTablesToggle() {
    return (
      <div>
        <p className="showAllTablesText" onClick={() => { this.setState({showingAllTables: true}) }}>&#9660; Show All Tables &#9660;</p>
      </div>
    );
  }
  
  render() {
    return(
      <div>
        <h1>{this.props.tableData.restaurant}</h1>
        {this.statistics()}
        {this.showTables()}
        {this.state.showingAllTables ? this.hideTablesToggle() : this.showAllTablesToggle()}
      </div>
    );
  }
}

module.exports = SingleRestaurantSegment;