import React from 'react';

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
  },  
  propTypes : {
    tagline : React.PropTypes.string.isRequired
  }
});

export default Header;