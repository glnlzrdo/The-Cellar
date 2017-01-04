import React from 'react';
import h from '../helpers';

/*
  Liquor Component
*/
import autobind from 'autobind-decorator';

@autobind
class Liquor extends React.Component {

  onButtonClick() {
    var key = this.props.index;
    this.props.addToBarrel(this.props.index);
  }

  render() {
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
}

export default Liquor;