import React, { Component } from 'react';

export default class InputFilter extends Component {

  hangleInputChange = (event) => {
    const filtro = event.target.value;
    this.props.onTypeFilter(filtro);
  }

  render() {
    const { label, value } = this.props;
    return (
      <div className="input-field col s3">
        <input type="text" value={value} onChange={this.hangleInputChange} className="validate"/>
      <label className="active">{label}</label>
    </div>
    )
  }
}
