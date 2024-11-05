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
  MarkerType,
  EdgeTypes,
  OnConnectEnd,
  ConnectionMode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

/** Custom styles imports */
import ContextMenu from "./styles/menu";

/** Material UI imports */
import Button from "@mui/material/Button";

/** Custom components imports */
import StyledNode from "./components/nodes/StyledNode";
import AggregationEdge from "./components/edges/AggregationEdge";
import AssociationEdge from "./components/edges/AssociationEdge";
import CompositionEdge from "./components/edges/CompositionEdge";
import DependencyEdge from "./components/edges/DependencyEdge";
import ImplementationEdge from "./components/edges/ImplementationEdge";
import InheritanceEdge from "./components/edges/InheritanceEdge";

/** Custom hooks imports */
import { useGlobalContext, type GlobalContext } from "./hooks/useGlobalContext";
import UMLNode, { CustomNode } from "./model/UMLNode";
import Trait from "./model/Trait";
import AbstractClass from "./model/AbstractClass";
import ConcreteClass from "./model/ConcreteClass";

function App() {
  const ctx: GlobalContext = useGlobalContext();

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

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => ctx.setEdges((edges) => {
      console.log(changes);
      console.log(edges);
      return applyEdgeChanges(changes, edges);
    }),
    [ctx.setEdges]
  );

  const onConnectEnd: OnConnectEnd = useCallback(
    (event, connectionState) => {
      console.log("a");
      let validConnection = connectionState.fromNode && connectionState.fromHandle
        && connectionState.toNode && connectionState.toHandle;

      if (validConnection) {
        console.log({
          source: connectionState.fromNode?.id as string,
          target: connectionState.toNode?.id as string,
          sourceHandle: connectionState.fromHandle?.id as string,
          targetHandle: connectionState.toHandle?.id as string,
        })
        let nodes: UMLNode[] = [];
        ctx.setNodes((oldNodes) => {
          nodes = oldNodes;
          return oldNodes;
        });
        // TODO: Que se puedan saber los nodos source y tareet...
        console.log("Node source", ctx.nodes.find((n) => n.id === Number(connectionState.fromNode?.id)));
        console.log("Node target", ctx.nodes.find((n) => n.id === Number(connectionState.toNode?.id)));
        return ctx.setEdges((edges) => {
          return addEdge({
            source: connectionState.fromNode?.id as string,
            target: connectionState.toNode?.id as string,
            sourceHandle: connectionState.fromHandle?.id as string,
            targetHandle: connectionState.toHandle?.id as string,
            type: 'inheritance',
            style: {
              stroke: 'black'
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 30,
              height: 30,
              color: 'black'
            },
          }, edges);
        });
      }
    }, [ctx.setEdges]);

  /** Custom node styling under the StyledNode component. */
  // Empty dependences causes this to not rerender. 

  const createNodeComponent = (ctx: GlobalContext, props: NodeProps<CustomNode>) => (
    <StyledNode
      setNodes={ctx.setNodes}
      node={props}
    />
  );

  function CustomNodeTypes(ctx: GlobalContext): NodeTypes {
    return useMemo(() => {
      return {
        abstractClass: (props) => createNodeComponent(ctx, props),
        concreteClass: (props) => createNodeComponent(ctx, props),
        trait: (props) => createNodeComponent(ctx, props)
      }
    }, []);
  };

  const edgeTypes: EdgeTypes = {
    aggregation: AggregationEdge,
    association: AssociationEdge,
    composition: CompositionEdge,
    dependency: DependencyEdge,
    implementation: ImplementationEdge,
    inheritance: InheritanceEdge
  };

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
                  ctx.setNodes((oldNodes) => {
                    const newNode = new Trait(
                      ctx.generateNodeId(),
                      ctx.DEFAULT_NODE_NAME,
                      ctx.DEFAULT_NODE_METHODS,
                      ctx.DEFAULT_NODE_FIELDS,
                      ctx.relativeMouseCoordinate.x,
                      ctx.relativeMouseCoordinate.y
                    );
                    return [...oldNodes, newNode];
                  });
                }}>Add Trait</li>
                <li onClick={() => {
                  ctx.setNodes((oldNodes) => {
                    const newNode = new AbstractClass(
                      ctx.generateNodeId(),
                      ctx.DEFAULT_NODE_NAME,
                      ctx.DEFAULT_NODE_METHODS,
                      ctx.DEFAULT_NODE_FIELDS,
                      ctx.relativeMouseCoordinate.x,
                      ctx.relativeMouseCoordinate.y
                    );
                    return [...oldNodes, newNode];
                  });
                }}>Add Abstract Class</li>
                <li onClick={() => {
                  ctx.setNodes((oldNodes) => {
                    const newNode = new ConcreteClass(
                      ctx.generateNodeId(),
                      ctx.DEFAULT_NODE_NAME,
                      ctx.DEFAULT_NODE_METHODS,
                      ctx.DEFAULT_NODE_FIELDS,
                      ctx.relativeMouseCoordinate.x,
                      ctx.relativeMouseCoordinate.y
                    );
                    return [...oldNodes, newNode];
                  });
                }}>Add Concrete Class</li>
              </ul>
            </>
          </ContextMenu>
        )}

        <ReactFlow
          nodes={ctx.nodes.map((n) => n.getNode())}
          edges={ctx.edges}
          nodeTypes={CustomNodeTypes(ctx)}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onInit={ctx.setReactFlowInstance}
          onConnectEnd={onConnectEnd}
          connectionMode={ConnectionMode.Loose}
          fitView={false}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </>
    </div>
  );
}

export default App;
