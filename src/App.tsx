import React from 'react';
import { ReactFlow, Background, Controls, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
//import './App.css';

const nodes = [
  {
    id: '1', // required
    position: { x: 0, y: 0 }, // required
    data: { label: 'Hello' }, // required
  },
];

function App() {
  return (
    <div style={{ height: 700 }}>
      <ReactFlow nodes={nodes}>
        <Panel
          style={{ backgroundColor: "white" }}
          position="top-right"
        >
          Panel interactivo
        </Panel>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default App;
