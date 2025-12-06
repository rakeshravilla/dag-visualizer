import { generateMockDag } from '../data/mockAirflowGenerator';

// Start mapping layers based on keywords
const inferLayer = (taskId, operator) => {
  const lowerId = taskId.toLowerCase();

  if (lowerId.includes('inbound') || lowerId.includes('source') || lowerId.includes('api') || lowerId.includes('extract')) return 'inbound';
  if (lowerId.includes('lake') || lowerId.includes('raw') || lowerId.includes('landing') || lowerId.includes('s3')) return 'lake';
  if (lowerId.includes('mart') || lowerId.includes('transform') || lowerId.includes('dim') || lowerId.includes('fact')) return 'mart';
  if (lowerId.includes('egress') || lowerId.includes('export') || lowerId.includes('report') || lowerId.includes('notify')) return 'egress';

  return 'lake'; // Default fallback
};

const inferTaskType = (operator) => {
  if (!operator) return 'unknown';
  const op = operator.toLowerCase();
  if (op.includes('sensor') || op.includes('listen')) return 'source';
  if (op.includes('transfer') || op.includes('upload')) return 'storage';
  if (op.includes('operator') || op.includes('run')) return 'transform';
  return 'transform';
};

const calculateLayeredPosition = (nodeId, layer, indexInLayer) => {
  // Map layers to X coordinates
  const layerX = {
    'inbound': 0,
    'lake': 350,
    'mart': 700,
    'egress': 1050
  };

  // Y coordinate based on index in that layer
  const y = 50 + (indexInLayer * 120);

  return {
    x: layerX[layer] || 350,
    y: y
  };
};

export const parseDagFromAirflow = (dagData) => {
  const { dag_id, tasks } = dagData;

  // First pass: Group by layer to calculate positions
  const layerGroups = { inbound: [], lake: [], mart: [], egress: [] };

  const enrichedTasks = tasks.map(task => {
    const layer = inferLayer(task.task_id, task.operator);
    layerGroups[layer].push(task.task_id);
    return { ...task, layer };
  });

  const nodes = enrichedTasks.map((task) => {
    const layerIndex = layerGroups[task.layer].indexOf(task.task_id);

    return {
      id: task.task_id,
      position: calculateLayeredPosition(task.task_id, task.layer, layerIndex),
      data: {
        label: task.task_id,
        layer: task.layer,
        status: task.state || 'pending',
        taskType: inferTaskType(task.operator),
        duration: task.duration,
        operator: task.operator
      }
    };
  });

  const edges = [];
  tasks.forEach(task => {
    if (task.downstream_task_ids) {
      task.downstream_task_ids.forEach(downstreamId => {
        edges.push({
          id: `e${task.task_id}-${downstreamId}`,
          source: task.task_id,
          target: downstreamId,
          animated: task.state === 'running',
          type: 'smoothstep',
          style: { stroke: 'var(--text-secondary)', strokeWidth: 1 }
        });
      });
    }
  });

  return { id: dag_id, name: dag_id.replace(/_/g, ' ').toUpperCase(), nodes, edges };
};

export const fetchDagFromApi = async (dagId, runId) => {
  // SIMULATION MODE
  console.log(`[Mock API] Fetching DAG ${dagId}...`);

  return new Promise((resolve) => {
    setTimeout(() => {
      const mockData = generateMockDag(dagId);
      resolve(parseDagFromAirflow(mockData));
    }, 800);
  });
};
