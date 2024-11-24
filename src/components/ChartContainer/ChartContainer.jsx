import React from 'react';
import PropTypes from 'prop-types';
import './ChartContainer.css';

const ChartContainer = ({ children, height = 300 }) => {
  return (
    <div 
      className="chart-container"
      style={{ 
        width: '100%', 
        height, 
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
      }}
    >
      {children}
    </div>
  );
};

ChartContainer.propTypes = {
  children: PropTypes.node.isRequired,
  height: PropTypes.number
};

export default ChartContainer;