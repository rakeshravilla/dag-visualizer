import React from 'react';
import './Toolbar.css';

const Toolbar = ({ onRefresh, onAutoLayout, onLoadMock, isRefreshing }) => {
  return (
    <div className="toolbar">
      <button
        className="toolbar-btn"
        onClick={onRefresh}
        disabled={isRefreshing}
      >
        {isRefreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
      </button>
      <button
        className="toolbar-btn"
        onClick={onAutoLayout}
      >
        📐 Auto Layout
      </button>
      <button
        className="toolbar-btn"
        onClick={onLoadMock}
        title="Simulate fetching a new DAG from Airflow API"
      >
        🎲 Load Random DAG
      </button>
    </div>
  );
};

export default Toolbar;
