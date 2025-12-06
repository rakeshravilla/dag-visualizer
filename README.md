# DAG Visualizer

A React Flow-based tool for visualizing data pipelines with a 4-layer architecture (Inbound → Lake → Mart → Egress).

## Features

-   **Automatic Layout**: Powered by `dagre` for perfect node positioning.
-   **Mock Airflow API**: Simulations for data fetching and random DAG generation.
-   **Interactive Nodes**: Glassmorphic UI with detail views.
-   **Layer-Based Styling**: Automatic color coding for Inbound (Blue), Lake (Purple), Mart (Green), and Egress (Orange).

## Setup

```bash
npm install
npm run dev
```

## Adding Data

Edit `src/data/sampleDags.js`. You do **not** need to provide X/Y coordinates; the auto-layout engine handles it.

```javascript
export const myPipeline = {
  id: 'my_pipeline',
  nodes: [
    { id: 'source', data: { label: 'API', layer: 'inbound' } },
    { id: 'dest', data: { label: 'Table', layer: 'lake' } }
  ],
  edges: [
    { source: 'source', target: 'dest' }
  ]
};
```
