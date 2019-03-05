// Dependencies
const React = require('react');
const axios = require('axios');

// Shows all your tables in the restaurant settings
class MyOwnTables extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myTables: []
    }
    this.getMyTables = this.getMyTables.bind(this);
    this.addMultiTables = this.addMultiTables.bind(this);
    this.addCustomTable = this.addCustomTable.bind(this);
    this.removeTable = this.removeTable.bind(this);
    this.removeAllTables = this.removeAllTables.bind(this);
    this.toggleAvailability = this.toggleAvailability.bind(this);
    this.getMyTables();
    this.green = {
      color: "green"
    }
    this.red = {
      color: "red"
    }
  }
  
  // Get My Tables - update state with data of own tables from DB
  getMyTables() {
    axios.get('/listMyTables')
    .then(res => {
      this.setState({myTables: res.data});
    });
  }
  
  // Add multiple tables in one fell swoop from 'Table_1' to specified number
  addMultiTables() {
    const numberOfTables = document.getElementById('tableNumberInput').value;
    axios.post('/addMultiTables', {tables: numberOfTables})
      .then(() => {
      console.log('multi tables updated');
      this.getMyTables();
    });
  }
  
  // Add your own table with a custom name (e.g. outdoor tables etc)
  addCustomTable() {
    const customTable = document.getElementById('nameOfTableInput').value;
    axios.post('/addCustomTable', {tableName: customTable})
      .then(() => {
      console.log('single table updated');
      this.getMyTables();
    });
  }
  
  // Remove a table
  removeTable(tableName) {
    axios.post('/deleteTable', {tableToDelete: tableName})
    .then(res => {
      this.getMyTables();
    });
  }
  
  // Toggle whether a table is available or not
  toggleAvailability(tableName) {
    axios.post('/toggleAvailability', {tableToToggle: tableName})
    .then(res => {
      this.getMyTables();
    });
  }
  
  // Show tables
  showTables() {
    let tableArr = [];
    for (let i = 0; i < this.state.myTables.length; i++) {
      const nameOfTable = this.state.myTables[i].numberOrName;
      const available = this.state.myTables[i].available;
      tableArr.push(
        <div className="tableRow">
          <div>{nameOfTable}</div>
          <div style={available ? this.green : this.red} onClick={() => { this.toggleAvailability(nameOfTable) }}>
            {available ? "Available" : "Unavailable"}
          </div>
          <button className="removeBtn" onClick={() => { this.removeTable(nameOfTable) }}>Remove</button>
        </div>
      );
    }
    return tableArr;
  }
  
  // Remove all tables
  removeAllTables() {
    if (confirm("Are you sure you want to delete all of your tables? This cannot be undone.")) {
      axios.post('/removeAllTables', {})
      .then(res => {
        this.setState({myTables: []});
      });
    }
  }
  
  render() {
    return(
      <div>
        <div className="spaceAround">
          <div>
            <h2>Automatically Generate Tables</h2>
            <div className="restaurantInputSection">
              <label for="tableNumberInput">Number of Tables: </label>
              <input type="number" id="tableNumberInput" min="1"></input>
              <button onClick={this.addMultiTables}>Add</button>
            </div>
          </div>
          <div>
            <h2>Add Custom Table</h2>
            <div className="restaurantInputSection">
              <label>Name of Table:</label>
              <input type="text" id="nameOfTableInput"></input>
              <button onClick={this.addCustomTable}>Add</button>
            </div>
          </div>
        </div>
        {this.showTables()}
        <button onClick={this.removeAllTables}>Remove All Tables</button>
      </div>
    );
  }
}

module.exports = MyOwnTables;