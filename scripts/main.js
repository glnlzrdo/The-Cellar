var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var History = ReactRouter.History;

var createBrowserHistory = require('history/lib/createBrowserHistory');

var h = require('./helpers')

/*
  Firebase
*/
var Rebase = require('re-base');
var base = Rebase.createClass('https://appdevbuddy.firebaseio.com/');


var Catalyst = require('react-catalyst');


/* Component Imports */
import NotFound from './components/NotFound';
import Header from './components/Header';
import StorePicker from './components/StorePicker';
import AddLiquorForm from './components/AddLiquorForm';
import Liquor from './components/Liquor';
import Barrel from './components/Barrel';
import Inventory from './components/Inventory';



/*
  App
*/

var App = React.createClass({
  mixins : [Catalyst.LinkedStateMixin],
  getInitialState : function() {
    return {
      liquors : {},
      order : {}
    }
  },
  componentDidMount : function(){
    //Pull Data from firebase
    base.syncState(this.props.params.storeId + '/liquors', {
      context : this,
      state : 'liquors'
    });

    var localStorageRef = localStorage.getItem('order' + this.props.params.storeId);
    if(localStorageRef) {
      this.setState({
        order : JSON.parse(localStorageRef)
      });
    }
  },
  componentWillUpdate : function(nextProps, nextState){
    localStorage.setItem('order' + this.props.params.storeId, JSON.stringify(nextState.order));
  },
  addToBarrel : function(key) {
    this.state.order[key] = this.state.order[key] + 1 || 1;
    this.setState({ order : this.state.order });
  },
  removeFromBarrel : function(key) {
    delete this.state.order[key];
    this.setState({
      order : this.state.order
    });
  },
  addLiquor : function(liquor) {
    var timestamp = (new Date()).getTime();
    // update the state object
    this.state.liquors['liquor-' + timestamp] = liquor;
    // set the state
    this.setState({ liquors : this.state.liquors });
  },

  removeLiquor : function(key) {
    if (confirm("Are you sure you want to remove this liquor?!")) {
      this.state.liquors[key] = null;
      this.setState({
        liquors : this.state.liquors
      });
    }
  },
  loadSamples : function() {
    this.setState({
      liquors : require('./liquors')
    });
  },
  renderLiquor : function(key) {
    return <Liquor key={key} index={key} details={this.state.liquors[key]} addToBarrel={this.addToBarrel}/>
  },
  render : function() {
    return (
      <div className="the-cellar">
        <div className="menu">
          <Header tagline="Dark, Yet Glowing" />
          <ul className="list-of-liquors">
            {Object.keys(this.state.liquors).map(this.renderLiquor)}
          </ul>
        </div>  
        <Barrel liquors={this.state.liquors} 
          order={this.state.order} 
          removeFromBarrel={this.removeFromBarrel}/>
        <Inventory 
          addLiquor={this.addLiquor} 
          loadSamples={this.loadSamples} 
          liquors={this.state.liquors} 
          linkState={this.linkState} 
          removeLiquor={this.removeLiquor}/>
      </div>
    )
  }
});









/*
  Routes
*/

var routes = (
  <Router history={createBrowserHistory()}>
    <Route path="/" component={StorePicker} />
    <Route path="/store/:storeId" component={App} />
    <Route path="*" component={NotFound} />
  </Router>
)


ReactDOM.render(routes, document.querySelector('#main'));
