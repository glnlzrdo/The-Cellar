import React from 'react';

/*
  Barrel
  <Barrel/>
*/

import h from '../helpers';
import CSSTransitionGroup from 'react-addons-css-transition-group';

import autobind from 'autobind-decorator';

@autobind
class Barrel extends React.Component {
  renderBarrel(key) {
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
  }

  render() {
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
}

  Barrel.propTypes = {
    liquors : React.PropTypes.object.isRequired,
    order : React.PropTypes.object.isRequired,
    removeFromBarrel : React.PropTypes.func.isRequired
  }


export default Barrel;