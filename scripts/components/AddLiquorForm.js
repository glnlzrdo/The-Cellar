import React from 'react';

/*
  Add Liquor Form
*/
import autobind from 'autobind-decorator';

@autobind
class AddLiquorForm extends React.Component {
//var AddLiquorForm = React.createClass({
  createLiquor(event) {
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
  }

  render() {
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
}

export default AddLiquorForm;