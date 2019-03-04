const React = require('react');
const axios = require('axios');

const TableOfMyTables = require('./tableOfMyTables');

class RestaurantSettings extends React.Component {
  constructor(props) {
    super(props);
    this.style = {
      display: "none"
    }

  }
  
  exit() {
    document.getElementById('restaurantSettings').style.display = "none";
  }
  
  render() {
    return(
      <div style={this.style} id="restaurantSettings">
        <div id="rsInnerBox">
          <h1>Restaurant Settings</h1> 
          <TableOfMyTables/>
          <button onClick={this.exit}>Exit</button>
        </div>
      </div>
    );
  }
}

module.exports = RestaurantSettings;