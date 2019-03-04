// Dependencies
const React = require('react');
const axios = require('axios');

const UserForm = require('./userForm');

class LoginRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      isRestaurant: false,
      realname: ""
    }
    this.checkIfLoggedIn();
  }
  
  checkIfLoggedIn() {
    axios.get('/amILoggedIn')
    .then(res => {
      if (res.data.username !== undefined) {
        this.setState({
          loggedIn: true, 
          realname: res.data.realname, 
          isRestaurant: res.data.isRestaurant
        });
        document.getElementById("app").style.flexDirection = "column";
      }
    });
  }
  
  logout() {
    axios.post('/logout')
    .then(res => {
      console.log(res.data);
      window.location.reload();
    });
  }
  
  showRestaurantSettings() {
    document.getElementById("restaurantSettings").style.display = "block";
  }
  
  restaurantButton() {
    return(
      <div>
        <button onClick={this.showRestaurantSettings}>Restaurant Settings</button>
      </div>
    );
  }
  
  loggedIn() {
    return(
      <div id="welcomeMessage">
        <h2>Welcome {this.state.realname}</h2>
        <button onClick={this.logout}>Log out</button>
        {this.state.isRestaurant ? this.restaurantButton() : ""}
      </div>
    );
  }
  
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