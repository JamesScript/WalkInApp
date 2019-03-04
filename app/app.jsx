const React = require('react');
const ReactDOM = require('react-dom');

const LoginRegister = require('./loginRegister');
const TableSection = require('./tableSection');
const RestaurantSettings = require('./restaurantSettings');

class App extends React.Component {
  constructor(props) {
    super(props);
  }  
  
  render() {
    return(
      <div id="app">
        <LoginRegister/>
        <TableSection/>
        <RestaurantSettings/>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('main'));