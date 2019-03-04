const React = require('react');
const axios = require('axios');

class SingleRestaurantSegment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showingAllTables: false
    }
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
      
    });
  }
  
  showTables() {
    let tableArr = [];
    const tablesLength = this.props.tableData.tables.length;
    let limiter = this.state.showingAllTables || tablesLength < 3 ? tablesLength : 3;
    const restaurant = this.props.tableData.restaurant;
    const _id = this.props.tableData._id;
    for (let i = 0; i < limiter; i++) {
      const currentTable = this.props.tableData.tables[i];
      tableArr.push(
        <div className="tableRow">
          <p>{currentTable.numberOrName}</p>
          <p>{currentTable.available}</p>
          <label>Rating: </label>
          <input id={"ratingTable_"+currentTable.numberOrName+"_"+_id} type="number" min="0" max="5"></input>
          <button onClick={() => { this.submitRating(currentTable.numberOrName)}}>Rate Table</button>
        </div>
      );
    }
    return tableArr;
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
        {this.showTables()}
        {this.state.showingAllTables ? this.hideTablesToggle() : this.showAllTablesToggle()}
      </div>
    );
  }
}

module.exports = SingleRestaurantSegment;