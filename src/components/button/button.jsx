import React from 'react';
import './button.css'
const button = ({_id, measure, dimensions, onClick}) => {
  return <li className="nav-item">
  <button key={_id} className="nav-link" onClick={onClick}>
    {measure}
  </button>
</li>;
};

export default button;
