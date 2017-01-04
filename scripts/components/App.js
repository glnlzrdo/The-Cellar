import React from 'react';

/*
  App
*/

import Header from './Header';
import Liquor from './Liquor';
import Barrel from './Barrel';
import Inventory from './Inventory';
import Catalyst from 'react-catalyst';
import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator';

/*
  Firebase
*/
import Rebase from 're-base';
var base = Rebase.createClass('https://appdevbuddy.firebaseio.com/');

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

    var localStorageRef = localStorage.getItem('order-' + this.props.params.storeId);
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
      liquors : require('../liquors')
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

export default App;