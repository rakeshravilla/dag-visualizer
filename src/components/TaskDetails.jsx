import React from 'react';
import './TaskDetails.css';

const TaskDetails = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <div className="task-details-panel">
      <div className="panel-header">
        <h3>Node Details</h3>
        <button onClick={onClose} className="close-btn">✕</button>
      </div>
      <div className="panel-content">
        <div className="detail-row">
          <span className="detail-label">Node ID:</span>
          <span className="detail-value">{task.id}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Name:</span>
          <span className="detail-value">{task.label}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Layer:</span>
          <span className={`detail-value layer-${task.layer}`}>
            {task.layer || 'N/A'}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Type:</span>
          <span className="detail-value">{task.taskType || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
