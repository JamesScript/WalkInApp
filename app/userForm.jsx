const React = require('react');

class UserForm extends React.Component {
  constructor(props) {
    super(props);
  }
  
  // Only include topPart and bottomPart if this is the register form
  
  topPart() {
    const realname = this.props.formType+"Realname";
    return(
      <div>
        <div id="userTypeChoice">
          <h3>I am a: </h3>
          <input type="radio" name="userType" id="customerRadio" value="customer"></input>
          <label for="customerRadio">Customer</label>
          <input type="radio" name="userType" id="restaurantRadio" value="restaurant"></input>
          <label for="customerRadio">Restaurant</label>
        </div>
        <div className="twoPerRow">
          <label for={realname}>Full Name: </label>
          <input type="text" id={realname} name={realname}></input>
        </div>
      </div>
    );
  }
  
  bottomPart() {
    const retype = this.props.formType+"RetypePassword";
    return(
      <div className="twoPerRow">
        <label for={retype}>Retype Password: </label>
        <input type="password" id={retype} name={retype}></input>
      </div>
    );
  }
  
  render() {
    const username = this.props.formType+"Username";
    const password = this.props.formType+"Password";
    const formID = this.props.formType+"Form";
    return(
      <form id={formID}>
        {this.props.formType === "register" ? this.topPart() : ""}
        <div className="twoPerRow">
          <label for={username}>Username: </label>
          <input type="text" id={username} name={username}></input>
          <label for={password}>Password: </label>
          <input type="password" id={password} name={password}></input>
        </div>
        {this.props.formType === "register" ? this.bottomPart() : ""}
      </form>
    );
  }
}

module.exports = UserForm;