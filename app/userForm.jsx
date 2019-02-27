const React = require('react');

class UserForm extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    const realname = this.props.formType+"Realname";
    const username = this.props.formType+"Username";
    const password = this.props.formType+"Password";
    const retype = this.props.formType+"RetypePassword";
    return(
      <form id="registerForm">
        <div id="userTypeChoice">
          <h3>I am a: </h3>
          <input type="radio" name="userType" id="customerRadio" value="customer"></input>
          <label for="customerRadio">customer</label>
          <input type="radio" name="userType" id="restaurantRadio" value="restaurant"></input>
          <label for="customerRadio">restaurant</label>
        </div>
        <label for={realname}>Full Name: </label>
        <input type="text" id={realname} name={realname}></input>
        <br></br>
        <label for={username}>Username: </label>
        <input type="text" id={username} name={username}></input>
        <label for={password}>Password: </label>
        <input type="text" id={password} name={password}></input>
        <label for={retype}>Retype Password: </label>
        <input type="text" id={retype} name={retype}></input>
      </form>
    );
  }
}

module.exports = UserForm;