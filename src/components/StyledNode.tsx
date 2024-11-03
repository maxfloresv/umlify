import {
  Dispatch,
  SetStateAction,
  useState,
  useRef
} from "react";
import { Handle, NodeProps, Position } from "@xyflow/react";
import UMLNode, { CustomNode, Visibility } from "../model/UMLNode";

import NodeFields from "./nodes/NodeFields";
import NodeMethods from "./nodes/NodeMethods";
import NodeHeader from "./nodes/NodeHeader";

import "./css/paragraph.css";
import "./css/containers.css";

type StyledNodeProps = {
  setNodes: Dispatch<SetStateAction<UMLNode[]>>;
  node: NodeProps<CustomNode>;
};

/** This quantity will define the handles for each side of the node */
const LEFT_RIGHT_HANDLES = 3;

/**
 * Represents a node in the canvas.
 * 
 * @param {StyledNodeProps} props - The properties needed to render the node.
 * @returns {JSX.Element} The node to be rendered in the canvas.
 */
const StyledNode = (props: StyledNodeProps): JSX.Element => {
  const { setNodes, node } = props;
  const { data } = node;

  /** Whether the current node is in Edit mode or not */
  const [editMode, setEditMode] = useState<boolean>(false);
  // Allows forcing rerenders in this component
  const [lastChange, setLastChange] = useState<Date | null>(null);
  /** Set the current panel expanded considering Fields and Methods */
  const [expanded, setExpanded] = useState<string | false>(false);

  const nodeRef = useRef<HTMLDivElement>(null);

  /**
   * Translates the visibility attribute into its symbol using pattern matching.
   * 
   * @param {Visibility | null} visibility - The visibility of the field or method.
   * @returns {string} The symbol that represents the visibility.
   */
  const drawVisibility = (visibility: Visibility | null): string => {
    switch (visibility) {
      case "public":
        return "+";
      case "protected":
        return "#";
      case "private":
        return "-";
      default:
        return "?";
    }
  };

  const handlePanelChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };

  const forceUpdate = () => setLastChange(new Date());

  /**
   * Creates an array of handles to be rendered in a certain position of the node.
   * 
   * @param {Position.Left | Position.Right} position - The position of the handles relative to the node.
   * @param {number} numHandles - The number of handles to be created.
   * @returns {JSX.Element[]} An array of handles to be rendered.
   */
  const createMultipleHandles = (position: Position.Left | Position.Right, numHandles: number): JSX.Element[] => {
    let identifier: string;
    let handles: JSX.Element[] = [];

    switch (position) {
      case Position.Left:
        identifier = "left";
        break;
      case Position.Right:
        identifier = "right";
        break;
    }

    for (let i = 1; i <= numHandles; i++) {
      handles.push(<Handle
        type="source"
        position={position}
        id={`${identifier}-handle-${i}`}
      />);
    }

    return handles;
  }

  /** Common props to be passed to each section of the node. */
  const commonSectionProps = {
    data,
    setNodes,
    editMode,
    forceUpdate
  };

  return (
    <>
      <div ref={nodeRef} style={{ maxWidth: "425px" }}>
        <Handle type="source" position={Position.Top} id="top-handle" />
        <Handle type="source" position={Position.Bottom} id="bottom-handle" />
        {createMultipleHandles(Position.Left, LEFT_RIGHT_HANDLES)}
        {createMultipleHandles(Position.Right, LEFT_RIGHT_HANDLES)}

        <div className="box-container">
          <NodeHeader
            {...commonSectionProps}
            node={node}
            setEditMode={setEditMode}
          />

          <NodeFields
            {...commonSectionProps}
            drawVisibility={drawVisibility}
            expanded={expanded}
            handlePanelChange={handlePanelChange}
          />

          <NodeMethods
            {...commonSectionProps}
            drawVisibility={drawVisibility}
            expanded={expanded}
            handlePanelChange={handlePanelChange}
          />
        </div>
      </div>
    </>
  );
}

export default StyledNode;
