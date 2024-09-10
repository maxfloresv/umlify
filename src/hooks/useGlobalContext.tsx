import { Edge, ReactFlowInstance } from "@xyflow/react";
import UMLNode from "../model/UMLNode";
import { useState, useRef } from "react";
import useCanvasRightClick from "./useCanvasRightClick";
import useNodeOperator from "./useNodeOperator";
import useAddingNodeModal from "./useAddingNodeModal";

/**
 * The global store of states and functions/methods that are used across the application.
 * @returns {object} The global context of the application.
 */
const useGlobalContext = () => {
  /** Nodes are the main elements of the diagram. They can be connected by edges. */
  const INITIAL_NODES: UMLNode[] = [];
  const INITIAL_EDGES: Edge[] = [];

  const [nodes, setNodes] = useState<UMLNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<Edge[]>(INITIAL_EDGES);

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

  const {
    nameNodeOperator,
    fieldsNodeOperator,
    methodsNodeOperator,
    updateNameNodeOperator,
    addFieldNodeOperator,
    removeFieldNodeOperator,
    addMethodNodeOperator,
    removeMethodNodeOperator,
  } = useNodeOperator();

  return {
    nodes,
    setNodes,
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
    nameNodeOperator,
    fieldsNodeOperator,
    methodsNodeOperator,
    updateNameNodeOperator,
    addFieldNodeOperator,
    removeFieldNodeOperator,
    addMethodNodeOperator,
    removeMethodNodeOperator,
    reactFlowWrapper,
    reactFlowInstance,
    setReactFlowInstance,
    relativeMouseCoordinate,
    setRelativeMouseCoordinate
  };
}

export default useGlobalContext;