// Dependencies
const React = require('react');

const UserForm = require('./userForm');

class LoginRegister extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div id="loginRegister">
        <h2>Returning? Log in below</h2>
        <UserForm formType="login"/>
        <h2>First time here? Register below</h2>
        <UserForm formType="register"/>
      </div>
    );
  }
}

module.exports = LoginRegister;