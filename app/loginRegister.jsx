// Dependencies
const React = require('react');
const axios = require('axios');

// Modules
const UserForm = require('./userForm');

// Log In and Registering Form
class LoginRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      opened: false,
      isRestaurant: false,
      realname: ""
    }
    this.checkIfLoggedIn();
  }
  
  // Check if logged in and update state with important user data
  checkIfLoggedIn() {
    axios.get('/userData')
    .then(res => {
      if (res.data.username !== undefined) {
        this.setState({
          loggedIn: true, 
          realname: res.data.realname, 
          isRestaurant: res.data.isRestaurant
        });
        document.getElementById("app").style.flexDirection = "column-reverse";
      }
    });
  }
  
  // Log out
  logout() {
    axios.post('/logout')
    .then(res => {
      window.location.reload();
    });
  }
  
  // Show restaurant settings - where restaurants can update their status
  showRestaurantSettings() {
    document.getElementById("restaurantSettings").style.display = "block";
  }
  
  // Restaurant Button - only show is user is a restaurant and not a customer
  restaurantButton() {
    return(
      <div>
        <button onClick={this.showRestaurantSettings}>Restaurant Settings</button>
      </div>
    );
  }
  
  // Render this if logged in
  loggedIn() {
    return(
      <div id="welcomeMessage">
        <h2>Welcome {this.state.realname}</h2>
        <button onClick={this.logout}>Log out</button>
        {this.state.isRestaurant ? this.restaurantButton() : ""}
      </div>
    );
  }
  
  // Render this if not logged in
  notLoggedIn() {
    return(
      <div id="loginRegister">
        <h2>Returning? Log in below</h2>
        <UserForm formType="login"/>
        <hr></hr>
        <h2>First time here? Register below</h2>
        <UserForm formType="register"/>
      </div>
    );
  }

  render() {
    return(
      <div>
        {this.state.loggedIn ? this.loggedIn() : this.notLoggedIn()}
      </div>
    );
  }
}

module.exports = LoginRegister;