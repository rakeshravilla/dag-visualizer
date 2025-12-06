import React from 'react';
import { Handle, Position } from 'reactflow';
import './CustomNode.css';

const CustomNode = ({ data }) => {
  const { label, layer, taskType, onClick } = data;

  const getLayerColor = () => {
    switch (layer) {
      case 'inbound': return '#3b82f6';  // Blue
      case 'lake': return '#8b5cf6';     // Purple
      case 'mart': return '#10b981';     // Green
      case 'egress': return '#f59e0b';   // Orange
      default: return '#6b7280';         // Gray
    }
  };

  const getTaskIcon = () => {
    switch (taskType) {
      case 'source': return '📥';
      case 'storage': return '🗄️';
      case 'transform': return '⚙️';
      case 'destination': return '📤';
      default: return '📋';
    }
  };

  return (
    <div
      className="custom-node"
      style={{ borderColor: getLayerColor() }}
      onClick={() => onClick && onClick(data)}
    >
      <Handle type="target" position={Position.Left} />
      <div className="node-header" style={{ backgroundColor: getLayerColor() }}>
        <span className="task-icon">{getTaskIcon()}</span>
        <span className="task-type">{layer || 'layer'}</span>
      </div>
      <div className="node-body">
        <div className="node-label">{label}</div>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default CustomNode;
