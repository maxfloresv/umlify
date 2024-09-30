import { Edge, ReactFlowInstance } from "@xyflow/react";
import UMLNode, { FieldType, MethodType } from "../model/UMLNode";
import { useState, useRef } from "react";
import useCanvasRightClick from "./useCanvasRightClick";
import useAddingNodeModal from "./useAddingNodeModal";

/**
 * The global store of states and functions/methods that are used across the application.
 * @returns {object} The global context of the application.
 */
const useGlobalContext = () => {
  /** Nodes are the main elements of the diagram. They can be connected by edges. */
  const INITIAL_NODES: UMLNode[] = [];
  const INITIAL_EDGES: Edge[] = [];

  const DEFAULT_NODE_NAME: string = "";
  const DEFAULT_NODE_FIELDS: FieldType[] = [];
  const DEFAULT_NODE_METHODS: MethodType[] = [];

  const [nodes, setNodes] = useState<UMLNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<Edge[]>(INITIAL_EDGES);

  const generateNodeId = () => {
    return nodes.length + 1;
  }

  // Allows me to disable the context menu in some components
  const [isMenuContextActive, setIsMenuContextActive] = useState<boolean>(true);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [
    reactFlowInstance,
    setReactFlowInstance
  ] = useState<ReactFlowInstance | null>(null);

  const {
    openNodeModal,
    setOpenNodeModal,
    addingNode,
    setAddingNode,
  } = useAddingNodeModal();

  const {
    rightClicked,
    setRightClicked,
    mouseCoordinate,
    setMouseCoordinate,
    relativeMouseCoordinate,
    setRelativeMouseCoordinate
  } = useCanvasRightClick();

  return {
    DEFAULT_NODE_NAME,
    DEFAULT_NODE_FIELDS,
    DEFAULT_NODE_METHODS,
    nodes,
    setNodes,
    generateNodeId,
    edges,
    setEdges,
    openNodeModal,
    setOpenNodeModal,
    addingNode,
    setAddingNode,
    rightClicked,
    setRightClicked,
    mouseCoordinate,
    setMouseCoordinate,
    isMenuContextActive,
    setIsMenuContextActive,
    reactFlowWrapper,
    reactFlowInstance,
    setReactFlowInstance,
    relativeMouseCoordinate,
    setRelativeMouseCoordinate
  };
}

export default useGlobalContext;