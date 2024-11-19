/** React & Reactflow imports */
import { useEffect, useCallback, useMemo, SetStateAction, Dispatch } from "react";
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
import UMLNode, { CustomNode, EdgeType } from "./model/UMLNode";
import Trait from "./model/Trait";
import AbstractClass from "./model/AbstractClass";
import ConcreteClass from "./model/ConcreteClass";
import InvalidConnectionException from "./exceptions/InvalidConnectionException";
import ExportButton from "./components/ExportButton";

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
      return applyEdgeChanges(changes, edges);
    }),
    [ctx.setEdges]
  );

  /**
   * Applies a set of rules in UML construction to determine the type of edge between two nodes.
   * 
   * @param {UMLNode} source The source node. 
   * @param {UMLNode} target The target node.
   * @returns {EdgeType} The type of the edge between the source and target nodes.
   */
  function defineEdgeType(source: UMLNode, target: UMLNode): EdgeType {
    return source.getEdgeType(target);
  }

  const onConnectEnd: OnConnectEnd = (_event, connectionState) => {
    // We can only proceed when the connection is clearly between two nodes.
    if (connectionState.fromNode && connectionState.fromHandle
      && connectionState.toNode && connectionState.toHandle) {
      const sourceId = connectionState.fromNode.id;
      const targetId = connectionState.toNode.id;

      let nodes: UMLNode[] = ctx.nodes;

      const sourceNode = nodes.find((node) => node.id === Number(sourceId)) as UMLNode;
      const targetNode = nodes.find((node) => node.id === Number(targetId)) as UMLNode;

      let edgeType: EdgeType | null = null;

      const [targetHandleNumber] = (connectionState.toHandle.id as string)
        .split("-")
        .slice(-1);

      switch (Number(targetHandleNumber)) {
        case 1:
          /** The first handle of each position refers to association */
          const targetName = targetNode.getName();

          const sourceFields = sourceNode.getFields();
          const sourceMethods = sourceNode.getMethods();

          const fieldUses = sourceFields.filter((field) => field.type == targetName);
          const methodUses = sourceMethods.filter((method) => {
            return method.domType.includes(targetName) || method.codType == targetName;
          });

          if (fieldUses.length > 0 || methodUses.length > 0) {
            edgeType = "association"
          }
          break;
        case 2:
          /** The second handle of each position refers to inheritance or implementation */
          try {
            edgeType = defineEdgeType(sourceNode, targetNode);
          } catch (error) {
            return;
          }
          break;
      }

      if (!edgeType)
        return;

      /** This implements correspondency between the source and target handles */
      let fixedSourceHandle: string[] = (connectionState.fromHandle?.id as string).split("-");
      fixedSourceHandle[fixedSourceHandle.length - 1] = targetHandleNumber;

      ctx.setEdges((edges) => {
        return addEdge({
          source: sourceId,
          target: targetId,
          sourceHandle: fixedSourceHandle.join("-"),
          targetHandle: connectionState.toHandle?.id as string,
          type: edgeType as string
        }, edges);
      });
    }
  };

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

  function CustomEdgeTypes(edgeSetter: Dispatch<SetStateAction<Edge[]>>): EdgeTypes {
    return useMemo(() => {
      const setterProperty = { setEdges: edgeSetter };
      return {
        aggregation: (props) => AggregationEdge({ ...props, ...setterProperty }),
        association: (props) => AssociationEdge({ ...props, ...setterProperty }),
        composition: (props) => CompositionEdge({ ...props, ...setterProperty }),
        dependency: (props) => DependencyEdge({ ...props, ...setterProperty }),
        implementation: (props) => ImplementationEdge({ ...props, ...setterProperty }),
        inheritance: (props) => InheritanceEdge({ ...props, ...setterProperty })
      }
    }, []);
  }

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
          edgeTypes={CustomEdgeTypes(ctx.setEdges)}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onInit={ctx.setReactFlowInstance}
          onConnectEnd={onConnectEnd}
          connectionMode={ConnectionMode.Loose}
          fitView={false}
        >
          <Panel style={{ backgroundColor: "white" }} position="top-right">
            <ExportButton nodes={ctx.nodes.map((n) => n.getNode())} />
          </Panel>
          <Background />
          <Controls />
        </ReactFlow>
      </>
    </div>
  );
}

export default App;
