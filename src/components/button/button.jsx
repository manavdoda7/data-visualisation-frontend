import React from 'react';
import './button.css'

const button = ({_id, str, onClick}) => {
  return <li className="nav-item">
  <button key={_id} className="nav-link" onClick={onClick}>
    {str}
  </button>
</li>;
};

export default button;
