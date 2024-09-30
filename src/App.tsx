/** React & Reactflow imports */
import { useEffect, useCallback, useMemo } from "react";
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
  NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

/** Custom styles imports */
import ContextMenu from "./styles/menu";

/** Material UI imports */
import Button from "@mui/material/Button";

/** Custom components imports */
import NodeModal from "./components/NodeModal";
import StyledNode from "./components/StyledNode";

/** Custom hooks imports */
import useGlobalContext from "./hooks/useGlobalContext";
import { CustomNode } from "./model/UMLNode";

function App() {
  const ctx = useGlobalContext();

  /** This handles the right-clicks on the canvas. */
  // Reference: https://blog.logrocket.com/creating-react-context-menu/ 
  useEffect(() => {
    const handleClick = () => ctx.setRightClicked(false);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) =>
      ctx.setNodes((nodes) => {
        const nodeList = nodes.map((n) => n.getNode());
        // We can only apply changes to a Node[] type.
        const modifiedNodes = applyNodeChanges(changes, nodeList);

        // Update each node with its correspondant modified node.
        for (let i = 0; i < nodes.length; i++) {
          nodes[i].updatePosition(modifiedNodes[i]);
        }

        return [...nodes];
      }),
    [ctx.setNodes]
  );

  /* TODO in the future
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((edges) => applyEdgeChanges(changes, edges)),
    [setEdges]
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    [setEdges]
  );*/

  /** Custom node styling under the StyledNode component. */
  // Empty dependences causes this to not rerender. 

  const createNodeComponent = (props: NodeProps<CustomNode>) => (
    <StyledNode
      nodeList={ctx.nodes}
      node={props}
      contextMenuModifier={ctx.setIsMenuContextActive}
      setNodes={ctx.setNodes}
    />
  );

  const nodeTypes: NodeTypes = useMemo(() => ({
    abstractClass: (props) => createNodeComponent(props),
    concreteClass: (props) => createNodeComponent(props),
    trait: (props) => createNodeComponent(props)
  }), []);

  return (
    <div ref={ctx.reactFlowWrapper} onContextMenu={(e) => {
      e.preventDefault();
      ctx.setRightClicked(true);

      const reactFlowBounds = ctx.reactFlowWrapper.current?.getBoundingClientRect();

      if (!ctx.reactFlowInstance || !reactFlowBounds) {
        return;
      }

      const position = ctx.reactFlowInstance.screenToFlowPosition({
        x: e.clientX - reactFlowBounds.left,
        y: e.clientY - reactFlowBounds.top
      });

      ctx.setRelativeMouseCoordinate(position);
      ctx.setMouseCoordinate({ x: e.clientX, y: e.clientY });
    }} style={{ height: "100%" }}>
      <>
        {ctx.rightClicked && ctx.isMenuContextActive && (
          <ContextMenu top={ctx.mouseCoordinate.y} left={ctx.mouseCoordinate.x}>
            <>
              <ul>
                <li onClick={() => {
                  ctx.setLastNodeType("trait");
                  ctx.setOpenNodeModal(true)
                }}>Add Trait</li>
                <li onClick={() => {
                  ctx.setLastNodeType("abstractClass")
                  ctx.setOpenNodeModal(true)
                }}>Add Abstract Class</li>
                <li onClick={() => {
                  ctx.setLastNodeType("concreteClass")
                  ctx.setOpenNodeModal(true)
                }}>Add Concrete Class</li>
              </ul>
            </>
          </ContextMenu>
        )}

        <NodeModal ctx={ctx} type={ctx.lastNodeType} />

        <ReactFlow
          nodes={ctx.nodes.map((n) => n.getNode())}
          edges={ctx.edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onInit={ctx.setReactFlowInstance}
          /* onEdgesChange={onEdgesChange} */
          /* onConnect={onConnect} */
          fitView={false}
        >
          <Panel style={{ backgroundColor: "white" }} position="top-right">
            {/* This gotta be deleted in the final version */}
            <Button disabled>
              Add node
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
