import React from 'react';

/*
  Inventory
  <Inventory/>
*/

import AddLiquorForm from './AddLiquorForm';
import autobind from 'autobind-decorator';
import firebase from 'firebase';
//const ref = new Firebase('https://appdevbuddy.firebaseio.com/');

//import * as Firebase from 'firebase';

  const config = {
    apiKey: "AIzaSyDZLktimVqUi4isQ1HscEtwBssijbeMjDU",
    authDomain: "appdevbuddy.firebaseapp.com",
    databaseURL: "https://appdevbuddy.firebaseio.com",
    storageBucket: "appdevbuddy.appspot.com",
    messagingSenderId: "819744510003"
  };
  firebase.initializeApp(config);




@autobind
class Inventory extends React.Component {

  constructor() {
    super();
    this.state = {
      uid : ''
    }
  }

  authenticate(provider) {

  	/* // Firebase sample auth popup
	firebase.auth().signInWithPopup(provider).then(function(result) {
	  // This gives you a Facebook Access Token. You can use it to access the Facebook API.
	  var token = result.credential.accessToken;
	  // The signed-in user info.
	  var user = result.user;
	  // ...

	  const storeRef = ref.child(this.props.params.storeId);

	}).catch(function(error) {
	  // Handle Errors here.
	  var errorCode = error.code;
	  var errorMessage = error.message;
	  // The email of the user's account used.
	  var email = error.email;
	  // The firebase.auth.AuthCredential type that was used.
	  var credential = error.credential;
	  // ...
	});
  }
  */

  firebase.auth().signInWithPopup(provider)
  	.then(this.authHandler)
  	.catch(err => console.error(err));
  }

  authHandler(authData) {
    const storeRef = firebase.database().ref('store/' + this.props.params.storeId);
    storeRef.on('value', (snapshot) => {
    	var data = snapshot.val() || {};

   		//claim the store if no owner
    	if (!data.owner) {
    		storeRef.set({
    			owner: authData.user.uid
    		});
    	}

    	//update the state to reflect the current store owner and logged in user
    	this.setState({
    		uid : authData.user.uid,
    		owner : data.owner || authData.user.uid
    	});


    });
  }

  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your store's Inventory</p>
        <button className="github"
        onClick={this.authenticate.bind(this, new firebase.auth.GithubAuthProvider())}>
        	Login using Github
        </button>
        <button className="facebook"
        onClick={this.authenticate.bind(this, new firebase.auth.FacebookAuthProvider())}>
        	Login using Facebook
        </button>
        <button className="twitter"
        onClick={this.authenticate.bind(this, new firebase.auth.TwitterAuthProvider())}>
        	Login using Twitter
        </button>
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