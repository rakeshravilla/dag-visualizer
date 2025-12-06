import React from 'react';
import './DagSelector.css';

const DagSelector = ({ dags, selectedDag, onSelectDag }) => {
  return (
    <div className="dag-selector">
      <label htmlFor="dag-select">Select DAG:</label>
      <select 
        id="dag-select"
        value={selectedDag} 
        onChange={(e) => onSelectDag(e.target.value)}
      >
        {dags.map((dag) => (
          <option key={dag.id} value={dag.id}>
            {dag.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DagSelector;
