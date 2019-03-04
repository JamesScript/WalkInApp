const React = require('react');
const axios = require('axios');

class UserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRestaurant: false,
      realname: "",
      username: "",
      password: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
    
  // Handles choice of radio buttons for customer vs restaurant
  chooseUserType(isRestaurant) {
    this.setState({isRestaurant: isRestaurant});
  }
  
  // Save changes to form in state
  handleChange() {
    const formType = this.props.formType;
    const getVal = field => document.getElementById(formType+field).value;
    const updateStateObject = {
      username: getVal("Username"),
      password: getVal("Password")
    }
    if (formType === "register") {
      updateStateObject.realname = getVal("Realname");
    }
    this.setState(updateStateObject);
  }
  
  // Submit form
  handleSubmit(e) {
    e.preventDefault();
    const formType = this.props.formType;
    // If registering, check if two password fields match
    if (formType === "register") {
      const getVal = field => document.getElementById(this.props.formType+field).value;  
      if (getVal("Password") !== getVal("RetypePassword")) {
        return alert("Passwords do not match");
      }
    }
    // Post request for either Register or Log in depending on this.props.formType
    axios.post('/'+this.props.formType, this.state)
    .then(res => { 
      // Registering: Username Exists
      if (res.data === "username exists") {
        return alert("Username already exists, choose a different one");
      // Registering: Registration Successful
      } else if (res.data === "registration successful") {
        axios.post('/login', this.state)
        .then(() => {
          window.location.reload();
        });
      // Logging in
      } else {
        console.log(res.data.username);
        if (res.data.username === undefined) {
          // Wrong password
          alert('wrong password');
        } else {
          // Successful Log In
          window.location.reload();
        }
      }
    });
  }
  
  // Only includes topPart and bottomPart if this is the register form
  // Top part asks whether user is a customer or restaurant, and their full name / restaurant name
  topPart() {
    const realname = this.props.formType+"Realname";
    return(
      <div>
        <div id="userTypeChoice">
          <h3>I am a: &nbsp;</h3>
          <input onChange={() => { this.chooseUserType(false)}} type="radio" name="userType" id="customerRadio" value="customer"></input>
          <label for="customerRadio">Customer</label>
          &nbsp;
          <input onChange={() => { this.chooseUserType(true)}} type="radio" name="userType" id="restaurantRadio" value="restaurant"></input>
          <label for="restaurantRadio">Restaurant</label>
        </div>
        <div className="twoPerRow">
          <label for={realname}>{this.state.isRestaurant ? "Restaurant Name: " : "Full Name: "}</label>
          <input type="text" id={realname} name={realname} required></input>
        </div>
      </div>
    );
  }
  // Bottom part asks them to retype their password, as is the case with most website registering
  bottomPart() {
    const retype = this.props.formType+"RetypePassword";
    return(
      <div className="twoPerRow">
        <label for={retype}>Retype Password: </label>
        <input type="password" id={retype} name={retype} required></input>
      </div>
    );
  }
  
  // Render component
  render() {
    const formType = this.props.formType;
    const username = formType+"Username";
    const password = formType+"Password";
    const formID = formType+"Form";
    const isReg = formType === "register";
    return(
      <div>
        <form onChange={this.handleChange} onSubmit={this.handleSubmit} id={formID}>
          {isReg ? this.topPart() : ""}
          <div className="twoPerRow">
            <label for={username}>Username: </label>
            <input type="text" id={username} name={username} required></input>
            <label for={password}>Password: </label>
            <input type="password" id={password} name={password} required></input>
          </div>
          {isReg ? this.bottomPart() : ""}
          <input type="submit" value={isReg? "Register" : "Log In"}></input>
        </form>
      </div>
    );
  }
}

module.exports = UserForm;