import React from 'react';

/*
  Inventory
  <Inventory/>
*/

import AddLiquorForm from './AddLiquorForm';

var Inventory = React.createClass({
  renderInventory : function(key) {
    var linkState = this.props.linkState;
    return (
      <div className="liquor-edit" key={key}>
        <input type="text" valueLink={linkState('liquors.' + key +'.name')}/>
        <input type="text" valueLink={linkState('liquors.' + key +'.price')}/>
        <select valueLink={linkState('liquors.' + key +'.status')}>
          <option value="unavailable">Sold Out!</option>
          <option value="available">On The Cellar!</option>          
        </select>
        <textarea valueLink={linkState('liquors.' + key +'.desc')}></textarea>
        <input type="text" valueLink={linkState('liquors.' + key +'.image')}/>        
        <button onClick={this.props.removeLiquor.bind(null, key)}>Remove Liquor</button>
      </div>
      )
  },
  render : function() {
    return (
      <div className="inventory">
        <h3>Inventory</h3>
        {Object.keys(this.props.liquors).map(this.renderInventory)}
        <AddLiquorForm {...this.props} />
        {/*<AddLiquorForm addLiquor={this.addLiquor} />*/}
        <button onClick={this.props.loadSamples}>Load Sample Data</button>
      </div>      
    )
  },
  propTypes : {
    addLiquor : React.PropTypes.func.isRequired,
    loadSamples : React.PropTypes.func.isRequired,
    liquors : React.PropTypes.object.isRequired,
    linkState : React.PropTypes.func.isRequired,
    removeLiquor : React.PropTypes.func.isRequired
  }
});

export default Inventory;