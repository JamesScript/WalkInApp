const React = require('react');
const axios = require('axios');

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
  
  checkIfLoggedIn() {
    axios.get('/amILoggedIn')
    .then(res => {
      this.setState({loggedIn: res.data});
    });
  }
  
  submitRating(tableName) {
    const restaurant = this.props.tableData.restaurant;
    const _id = this.props.tableData._id;
    const rating = document.getElementById("ratingTable_"+tableName+"_"+_id).value;
    const postObject = {
      restaurant: restaurant,
      rating: rating,
      tableName: tableName
    }
    axios.post('/rateTable', postObject)
    .then(res => {
      alert(res.data);
      // socket emit message
    });
  }
  
  rateTableSection(currentTable, _id) {
    return(
      <div>
        <label>Rating: </label>
        <input id={"ratingTable_"+currentTable.numberOrName+"_"+_id} type="number" min="0" max="5"></input>
        <button onClick={() => { this.submitRating(currentTable.numberOrName)}}>Rate Table</button>
      </div>
    );
  }
  
  showTables() {
    let tableArr = [];
    const tablesLength = this.props.tableData.tables.length;
    let limiter = this.state.showingAllTables || tablesLength < 3 ? tablesLength : 3;
    const restaurant = this.props.tableData.restaurant;
    const _id = this.props.tableData.shortid;
    for (let i = 0; i < limiter; i++) {
      const currentTable = this.props.tableData.tables[i];
      let avgRatingStr = "None";
      if (currentTable.ratings.length > 0) {
        const ratingsNums = currentTable.ratings.map(rating => rating.rating*1);
        const averageRating = ratingsNums.reduce((a, b) => a + b) / ratingsNums.length;
        avgRatingStr = Math.floor(averageRating) === averageRating ? averageRating.toString() : averageRating.toFixed(1);
      }
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
  
  statistics() {
    let availableTables = 0;
    for (let i = 0; i < this.props.tableData.tables.length; i++) {
      if (this.props.tableData.tables[i].available) { availableTables++; }
    }
    return(
      <div>
        <p>Tables Availability: {availableTables} / {this.props.tableData.tables.length}</p>
      </div>
    );
  }
  
  hideTablesToggle() {
    return(
      <div>
        <p className="showAllTablesText" onClick={() => { this.setState({showingAllTables: false}) }}>&#9650; Hide Most Tables &#9650;</p>
      </div>
    );
  }
  
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