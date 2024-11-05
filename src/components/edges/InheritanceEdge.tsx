import { EdgeProps } from "@xyflow/react";
import { AbstractEdge } from "./AbstractEdge"

/**
 * Represents an Inheritance Edge in an UML diagram.
 * 
 * @param {EdgeProps} props - The properties needed to render the edge.
 * @returns {JSX.Element} The edge to be rendered in the canvas.
 * 
 * @author Máximo Flores Valenzuela <https://github.com/maxfloresv>
 */
const InheritanceEdge = (props: EdgeProps): JSX.Element => {
  return (
    <AbstractEdge
      {...props}
      isDashed={false}
      markerFilled={false}
      markerType="triangle"
    />
  )
}

export default InheritanceEdge;