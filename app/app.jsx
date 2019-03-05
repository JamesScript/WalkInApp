// Dependencies
const React = require('react');
const ReactDOM = require('react-dom');

// Modules
const LoginRegister = require('./loginRegister');
const MainSection = require('./mainSection');
const RestaurantSettings = require('./restaurantSettings');

// The App
class App extends React.Component {
  constructor(props) {
    super(props);
  }  
  
  render() {
    return(
      <div id="app">
        <MainSection/>
        <LoginRegister/>
        <RestaurantSettings/>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('main'));