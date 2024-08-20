import { useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Panel,
  Edge,
  Node
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import Button from '@mui/material/Button';

const INITIAL_NODES: Node[] = [];
const INITIAL_EDGES: Edge[] = [];

function App() {
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<Edge[]>(INITIAL_EDGES);

  function handleAddNode() {
    const id = nodes.length;
    // Minimum separation between the nodes and the canvas' borders.
    const indent = 20;

    // Separation between nodes in x-axis and y-axis.
    const x_sep = 300;
    const y_sep = 100;

    // At which width we want to broke the nodes to change separation in y-axis.
    const canvas_broke_width = 1250;

    // Fixed position in (x, y) for this node.
    const x_fixed = indent + x_sep * id;
    const y_fixed = Math.floor(x_fixed / canvas_broke_width) * y_sep + indent;

    // TODO: Search for node width
    const _ = Math.floor(canvas_broke_width / x_fixed)

    const newNode: Node[] = [
      {
        id: String(id),
        position: { x: x_fixed, y: y_fixed },
        data: { label: `Nodo ${id}` }
      }
    ];

    setNodes([...nodes, ...newNode]);
  }

  return (
    <div style={{ height: 700 }}>
      <ReactFlow nodes={nodes} edges={edges}>
        <Panel
          style={{ backgroundColor: "white" }}
          position="top-right"
        >
          <Button variant="outlined" onClick={handleAddNode}>Añadir nodo</Button>
        </Panel>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default App;
