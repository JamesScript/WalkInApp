const React = require('react');
const axios = require('axios');

const MyOwnTables = require('./myOwnTables');

// Restaurant Settings - update your tables and their availabiity
class RestaurantSettings extends React.Component {
  constructor(props) {
    super(props);
    this.style = {
      display: "none"
    }
  }
  
  // Close the interface and update your restaurant for all to see
  exit() {
    document.getElementById('restaurantSettings').style.display = "none";
    socket.emit('update tables');
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