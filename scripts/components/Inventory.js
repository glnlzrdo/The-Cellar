import React from 'react';

/*
  Inventory
  <Inventory/>
*/

import AddLiquorForm from './AddLiquorForm';
import autobind from 'autobind-decorator';
import Firebase from 'firebase';
const ref = new Firebase('https://appdevbuddy.firebaseio.com/');

@autobind
class Inventory extends React.Component {

  constructor() {
    super();
    this.state = {
      uid : ''
    }
  }

  authenticate(provider) {
    ref.authWithOAuthPopup(provider, this.authHandler)
  }

  authHandler(err, authData) {
    if(err) {
      return;
    }

    const storeRef = ref.child(this.props.params.storeId);
  }

  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your store's Inventory</p>
        <button className="github" onClick={this.authenticate.bind(this, 'github')}>Login using Github</button>
        <button className="facebook" onClick={this.authenticate.bind(this, 'facebook')}>Login using Facebook</button>
        <button className="twitter" onClick={this.authenticate.bind(this, 'twitter')}>Login using Twitter</button>
      </nav>
    )
  }

  renderInventory(key) {
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
  }

  render() {
    let logoutButton = <button>Logout</button>
    // Check if a user isn't logged in
    if (!this.state.uid) {
      return (
        <div>{this.renderLogin()}</div>
      )
    }

    // Check if user logged in is not the owner
    if (this.state.uid !== this.state.owner) {
      return (
        <div>\
        <p>Sorry, you aren't the owner of this store...</p>
        {logoutButton}
        </div>
      )
    }

    return (
      <div className="inventory">
        <h3>Inventory</h3>
        {logoutButton}
        {Object.keys(this.props.liquors).map(this.renderInventory)}
        <AddLiquorForm {...this.props} />
        {/*<AddLiquorForm addLiquor={this.addLiquor} />*/}
        <button onClick={this.props.loadSamples}>Load Sample Data</button>
      </div>      
    )
  }

}
  
  Inventory.propTypes = {
    addLiquor : React.PropTypes.func.isRequired,
    loadSamples : React.PropTypes.func.isRequired,
    liquors : React.PropTypes.object.isRequired,
    linkState : React.PropTypes.func.isRequired,
    removeLiquor : React.PropTypes.func.isRequired
  }


export default Inventory;