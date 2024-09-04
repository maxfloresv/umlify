import { useState, useEffect, useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Panel,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
  NodeTypes,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import ContextMenu from "./styles/menu";

import type UMLNode from "./model/UMLNode";
import ConcreteClass from "./model/ConcreteClass";
import AbstractClass from "./model/AbstractClass";
import Trait from "./model/Trait";

import StyledNode from "./components/StyledNode";

import Button from "@mui/material/Button";
import { FieldType, MethodType } from "./model/UMLNode";

const INITIAL_NODES: UMLNode[] = [];
const INITIAL_EDGES: Edge[] = [];

interface Point {
  x: number;
  y: number;
};

function App() {
  const [nodes, setNodes] = useState<UMLNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<Edge[]>(INITIAL_EDGES);

  const [clicked, setClicked] = useState<Boolean>(false);
  const [points, setPoints] = useState<Point>({
    x: 0,
    y: 0,
  });

  // https://blog.logrocket.com/creating-react-context-menu/ 
  useEffect(() => {
    const handleClick = () => setClicked(false);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) =>
      setNodes((nodes) => {
        const nodeList = nodes.map((n) => n.getNode());
        // We can only apply changes to a Node[] type.
        const modifiedNodes = applyNodeChanges(changes, nodeList);

        // Update each node with its correspondant modified node.
        for (let i = 0; i < nodes.length; i++) {
          nodes[i].updateNode(modifiedNodes[i]);
        }

        return [...nodes];
      }),
    [setNodes]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((edges) => applyEdgeChanges(changes, edges)),
    [setEdges]
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );

  const nodeTypes = useMemo(
    () => ({
      abstractClass: StyledNode,
      concreteClass: StyledNode,
      trait: StyledNode,
    }),
    []
  );

  function handleAddNode() {
    const id = nodes.length;
    console.log(id);
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

    const methods: Object = {
      private: [{ characters: "ArrayBuffer[Character]" }],
    };

    const methods0: MethodType[] = [
      {
        name: "characters",
        domType: ["Number", "Number", "String"],
        codType: "ArrayBuffer[Character]",
        visibility: "private",
        abstract: false,
      },
    ];
    const attributes0: FieldType[] = [
      {
        name: "isDefeated",
        type: "Boolean",
        visibility: "protected",
      },
      {
        name: "addCharacter",
        type: "Unit",
        visibility: "private",
      },
    ];

    const newNode = new ConcreteClass(
      id,
      "Party",
      methods0,
      attributes0,
      x_fixed,
      y_fixed
    );
    const node2 = new AbstractClass(
      id + 1,
      "AbstractCharacter",
      methods0,
      attributes0,
      x_fixed + x_sep,
      y_fixed + y_sep
    );
    const node3 = new Trait(
      id + 2,
      "Character",
      methods0,
      attributes0,
      x_fixed + x_sep * 2,
      y_fixed + y_sep * 2
    );
    setNodes((prevNodes) => [...prevNodes, newNode, node2, node3]);
  }

  return (
    <div onContextMenu={(e) => {
      e.preventDefault();
      setClicked(true);
      setPoints({ x: e.pageX, y: e.pageY });
    }} style={{ height: "100%" }}>
      <>
        {clicked && (
          <ContextMenu top={points.y} left={points.x}>
            <ul>
              <li>Edit</li>
              <li>Copy</li>
              <li>Delete</li>
            </ul>
          </ContextMenu>
        )}

        <ReactFlow
          nodes={nodes.map((n) => n.getNode())}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView={true}
        >
          <Panel style={{ backgroundColor: "white" }} position="top-right">
            <Button variant="outlined" onClick={handleAddNode}>
              Añadir nodo
            </Button>
          </Panel>
          <Background />
          <Controls />
        </ReactFlow>
      </>
    </div>
  );
}

export default App;
