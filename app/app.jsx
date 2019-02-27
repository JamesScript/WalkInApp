const React = require('react');
const ReactDOM = require('react-dom');

const LoginRegister = require('./loginRegister');

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return(
      <div>
        <h1>WalkIn App</h1>
        <LoginRegister/>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('main'));