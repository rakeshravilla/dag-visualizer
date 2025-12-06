import React from 'react';
import './Legend.css';

const Legend = () => {
  const layers = [
    { name: 'Inbound', color: '#3b82f6', icon: '📥' },
    { name: 'Lake', color: '#8b5cf6', icon: '🗄️' },
    { name: 'Mart', color: '#10b981', icon: '⚙️' },
    { name: 'Egress', color: '#f59e0b', icon: '📤' },
  ];

  return (
    <div className="legend">
      <h4>Pipeline Layers</h4>
      <div className="legend-items">
        {layers.map(layer => (
          <div key={layer.name} className="legend-item">
            <div 
              className="legend-color" 
              style={{ backgroundColor: layer.color }}
            />
            <span className="legend-icon">{layer.icon}</span>
            <span>{layer.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend;
