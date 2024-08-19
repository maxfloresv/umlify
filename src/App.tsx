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
    const newNode: Node[] = [
      {
        id: String(nodes.length),
        position: { x: 0, y: 0 },
        data: { label: `Nodo ${nodes.length}` }
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
