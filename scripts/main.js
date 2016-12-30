var React = require('react');
var ReactDOM = require('react-dom');
var CSSTransitionGroup = require('react-addons-css-transition-group');

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
  Liquor Component
*/

var Liquor = React.createClass({
  onButtonClick : function() {
    var key = this.props.index;
    this.props.addToBarrel(this.props.index);
  },
  render : function() {
    var details = this.props.details;
    var isAvailable = (details.status === 'available' ? true : false);
    var buttonText = (isAvailable ? 'Add To Barrel' : 'Sold Out');
    return (
      <li className="menu-liquor">
        <image src={details.image} alt={details.name} />
        <h3 className="liquor-name">
          {details.name}
          <span className="price">{h.formatPrice(details.price)}</span>
        </h3>
        <p>{details.desc}</p>
        <button disabled={!isAvailable} onClick={this.onButtonClick}>{buttonText}</button>
      </li>
    )
  }
});

/*
  Add Liquor Form
*/

var AddLiquorForm = React.createClass({
  createLiquor : function(event) {
    // Stop the form from submitting
    event.preventDefault();
    // Take the data from the form and create an object
    var liquor = {
      name : this.refs.name.value,
      price : this.refs.price.value,
      status : this.refs.status.value,
      desc : this.refs.desc.value,
      image : this.refs.image.value
    }
    // Add the liquor to the App State
    this.props.addLiquor(liquor);
    this.refs.liquorForm.reset();
  },
  render : function() {
    return (
        <form className="liquor-edit" ref="liquorForm" onSubmit={this.createLiquor}>
          <input type="text" ref="name" placeholder="Liquor Name"/>
          <input type="text" ref="price" placeholder="Liquor Price"/>
          <select ref="status">
            <option value="available">On The Cellar!</option>
            <option value="unavailable">Sold Out!</option>
          </select>
          <textarea type="text" ref="desc" placeholder="Desc"></textarea>
          <input type="text" ref="image" placeholder="URL to Image"/>
          <button type="submit">+ Add Item</button>
        </form>
      )
  }
});

/*
  Header
  <Header/>
*/
var Header = React.createClass({
  render : function() {
    return (
      <header className="top">
        <h1>The Cellar</h1>
        <h3 className="tagline"><span>{this.props.tagline}</span></h3> 
      </header>
    )
  }
})

/*
  Barrel
  <Barrel/>
*/
var Barrel = React.createClass({
  renderBarrel : function(key) {
    var liquor = this.props.liquors[key];
    var count = this.props.order[key];
    var removeButton = <button onClick={this.props.removeFromBarrel.bind(null, key)}>&times;</button>
    var bottle;
    if (count > 1)
        bottle = '-bottles';
    else
        bottle = '-bottle';
    if (!liquor) {
      return <li key={key}>Liquor no longer available! {removeButton}</li>
    }

    return (
      <li key={key}>
        <span>
          <CSSTransitionGroup component="span" transitionName="count" transitionLeaveTimeout={250} transitionEnterTimeout={250} className="count">
            <span key={count}>{count}</span>
          </CSSTransitionGroup>          
             
           {bottle} of {liquor.name} {removeButton}

        </span>
            <span className="price">{h.formatPrice(count * liquor.price)}</span>                
      </li>
      )
  },
  render : function() {
    var orderIds = Object.keys(this.props.order);

    var total = orderIds.reduce((prevTotal, key)=>{
      var liquor = this.props.liquors[key];
      var count = this.props.order[key];
      var isAvailable = liquor && liquor.status === 'available';

      if (liquor && isAvailable) {
        return prevTotal + (count * parseInt(liquor.price) || 0);
      }
      return prevTotal;
    }, 0);

    return (
      <div className="order-wrap">
      <h2 className="order-title">Your Barrel</h2>

      <CSSTransitionGroup 
        className="order" 
        component="ul" 
        transitionName="order"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}>

        {orderIds.map(this.renderBarrel)}
        <li className='total'>
          <strong>Total:</strong>
          {h.formatPrice(total)}
        </li>    
      </CSSTransitionGroup>
      </div>
    )
  }
})

/*
  Inventory
  <Inventory/>
*/
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
  }
})


/* 
  StorePicker
  This will let us make <StorePicker/>
*/

var StorePicker = React.createClass({
  mixins : [History],
  goToStore : function(event) {
    event.preventDefault();
    // get data from input
    var storeId = this.refs.storeId.value;    
    // transition from <StorePicker/> to <App/>
    this.history.pushState(null, '/store/' + storeId);
  },
  render : function() {
    return (
      <form className="store-selector" onSubmit={this.goToStore}>
        <h2>Please Enter A Store</h2>
        <input type="text" ref="storeId" defaultValue={h.getFunName()} required />
        <input type="Submit" />
      </form>
    )
  }

});

/*
  Not Found
*/

var NotFound = React.createClass({
  render : function() {
    return <h3><center>Location Not Available!</center></h3>
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
