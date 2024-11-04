import {
  BaseEdge,
  getSmoothStepPath,
  useInternalNode,
  type EdgeProps,
} from '@xyflow/react';
import { getEdgeParams } from '../utils/calculations';
import generatePath from '../utils/generatePath';

// These are measured in pixels.
const MARKERS_WIDTH = 18;
const MARKERS_HEIGHT = 18;
const DIAMOND_FIXED_FACTOR = 3.5;

export type MarkerTypes = "hat" | "triangle" | "diamond";

// Considers the edge design properties.
type ExtendedEdgeProps = {
  isDashed: boolean;
  markerFilled?: boolean;
  markerType: MarkerTypes;
}

/**
 * Represents an abstract edge, without arrow properties and marker.
 * 
 * @param {EdgeProps & ExtendedEdgeProps} props - The edge properties. 
 *
 * @returns {JSX.Element | null} The edge to be rendered in the canvas.
 * 
 * @author Máximo Flores Valenzuela <https://github.com/maxfloresv>
 */
export function AbstractEdge({
  id,
  source,
  target,
  isDashed,
  markerFilled = false,
  markerType,
  style = {}
}: EdgeProps & ExtendedEdgeProps): JSX.Element | null {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const {
    sx: sourceX,
    sy: sourceY,
    tx: targetX,
    ty: targetY,
    sourcePos: sourcePosition,
    targetPos: targetPosition
  } = getEdgeParams(
    sourceNode,
    targetNode,
  );

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 0
  });

  // Extends the design if the arrow has to be dashed.
  const edgeStyle = {
    strokeDasharray: isDashed ? '5 5' : '0',
    ...style
  };

  return (
    <>
      <defs>
        {markerType === 'hat' && (
          <marker
            id="marker-hat"
            markerWidth={MARKERS_WIDTH}
            markerHeight={MARKERS_HEIGHT}
            refX={MARKERS_WIDTH}
            refY={MARKERS_HEIGHT / 2}
            orient="auto"
          >
            <path
              d={generatePath(markerType, MARKERS_WIDTH, MARKERS_HEIGHT)}
              fill="none"
              stroke="black"
            />
          </marker>
        )}
        {markerType === 'diamond' && (
          <marker
            id="marker-diamond"
            markerWidth={DIAMOND_FIXED_FACTOR * MARKERS_WIDTH}
            markerHeight={MARKERS_HEIGHT}
            refX={DIAMOND_FIXED_FACTOR * MARKERS_WIDTH}
            refY={MARKERS_HEIGHT / 2}
            orient="auto"
          >
            <path
              d={generatePath(markerType, DIAMOND_FIXED_FACTOR * MARKERS_WIDTH, MARKERS_HEIGHT)}
              fill={markerFilled ? "black" : "white"}
              stroke="black"
            />
          </marker>
        )}
        {markerType === 'triangle' && (
          <marker
            id="marker-triangle"
            markerWidth={MARKERS_WIDTH}
            markerHeight={MARKERS_HEIGHT}
            refX={MARKERS_WIDTH}
            refY={MARKERS_HEIGHT / 2}
            orient="auto"
          >
            <path
              d={generatePath(markerType, MARKERS_WIDTH, MARKERS_HEIGHT)}
              fill={markerFilled ? "black" : "white"}
              stroke="black"
            />
          </marker>
        )}
      </defs>

      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={`url(#marker-${markerType})`}
        style={edgeStyle}
      />
    </>
  );
}