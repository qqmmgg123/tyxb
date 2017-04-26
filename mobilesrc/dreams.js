import React, { Component } from 'react';

class Dreams extends Component {
  render() {
    return (
        <ul>
            {this.props.tags.map((tag, index) => (
                <li key={index}><a data-tid={tag._id} className="tag">{tag.key}</a></li>
            ))}
            </ul>

    )
  }
}

export default Dreams;

