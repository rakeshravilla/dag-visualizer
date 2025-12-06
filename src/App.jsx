import React, { useCallback, useState, useMemo, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './components/CustomNode';
import TaskDetails from './components/TaskDetails';
import DagSelector from './components/DagSelector';
import Legend from './components/Legend';
import Toolbar from './components/Toolbar';
import { allDags } from './data/sampleDags';
import { autoLayout } from './utils/layoutUtils';

import { fetchDagFromApi } from './utils/dagParser';

const nodeTypes = {
  custom: CustomNode,
};

function App() {
  const [dags, setDags] = useState(allDags);
  const [selectedDagId, setSelectedDagId] = useState(allDags[0].id);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Find the current DAG data either from state or fallback
  const currentDag = useMemo(
    () => dags.find(dag => dag.id === selectedDagId) || dags[0],
    [dags, selectedDagId]
  );

  const nodesWithHandlers = useMemo(() =>
    currentDag.nodes.map(node => ({
      ...node,
      type: 'custom',
      data: {
        ...node.data,
        onClick: (taskData) => setSelectedTask({ id: node.id, ...taskData })
      }
    })),
    [currentDag]
  );

  const edgesWithStyle = useMemo(() =>
    currentDag.edges.map(edge => ({
      ...edge,
      type: 'smoothstep',
      animated: edge.animated || false,
      style: { stroke: 'var(--text-secondary)', strokeWidth: 2, opacity: 0.5 },
      markerEnd: {
        type: 'arrowclosed',
        color: '#94a3b8',
      },
    })),
    [currentDag]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(nodesWithHandlers);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgesWithStyle);

  // Update nodes/edges when the selected DAG changes
  useEffect(() => {
    const layoutedNodes = autoLayout(nodesWithHandlers, edgesWithStyle);
    setNodes(layoutedNodes);
    setEdges(edgesWithStyle);
  }, [currentDag, nodesWithHandlers, edgesWithStyle, setNodes, setEdges]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleDagChange = (dagId) => {
    setSelectedDagId(dagId);
    setSelectedTask(null);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Refresh logic here
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleLoadMock = async () => {
    setIsRefreshing(true);
    const randomId = `pipeline_${Math.floor(Math.random() * 1000)}`;
    const newDag = await fetchDagFromApi(randomId, 'run_latest');

    setDags(prev => [...prev, newDag]);
    setSelectedDagId(newDag.id);
    setIsRefreshing(false);
  };

  const handleAutoLayout = () => {
    const layoutedNodes = autoLayout(nodes, edges);
    setNodes(layoutedNodes);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <DagSelector
        dags={dags}
        selectedDag={selectedDagId}
        onSelectDag={handleDagChange}
      />
      <Toolbar
        onRefresh={handleRefresh}
        onAutoLayout={handleAutoLayout}
        onLoadMock={handleLoadMock}
        isRefreshing={isRefreshing}
      />
      <Legend />
      <TaskDetails
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: false,
          style: { stroke: '#94a3b8', strokeWidth: 2 },
        }}
      >
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            switch (node.data.layer) {
              case 'inbound': return '#3b82f6';
              case 'lake': return '#8b5cf6';
              case 'mart': return '#10b981';
              case 'egress': return '#f59e0b';
              default: return '#6b7280';
            }
          }}
        />
        <Background variant="dots" gap={16} size={1} color="#e5e7eb" />
      </ReactFlow>
    </div>
  );
}

export default App;
