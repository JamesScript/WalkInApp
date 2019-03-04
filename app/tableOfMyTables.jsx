// Dependencies
const React = require('react');
const axios = require('axios');

class TableOfMyTables extends React.Component {
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
  
  getMyTables() {
    axios.get('/listMyTables')
    .then(res => {
      this.setState({myTables: res.data});
    });
  }
  
  addMultiTables() {
    const numberOfTables = document.getElementById('tableNumberInput').value;
    axios.post('/addMultiTables', {tables: numberOfTables})
      .then(() => {
      console.log('multi tables updated');
      this.getMyTables();
    });
  }
  
  addCustomTable() {
    const customTable = document.getElementById('nameOfTableInput').value;
    axios.post('/addCustomTable', {tableName: customTable})
      .then(() => {
      console.log('single table updated');
      this.getMyTables();
    });
  }
  
  removeTable(tableName) {
    axios.post('/deleteTable', {tableToDelete: tableName})
    .then(res => {
      this.getMyTables();
    });
  }
  
  toggleAvailability(tableName) {
    axios.post('/toggleAvailability', {tableToToggle: tableName})
    .then(res => {
      this.getMyTables();
    });
  }
  
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
  
  removeAllTables() {
    axios.post('/removeAllTables', {})
    .then(res => {
      this.setState({myTables: []});
    });
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

module.exports = TableOfMyTables;