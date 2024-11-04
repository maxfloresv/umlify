import { EdgeProps } from "@xyflow/react";
import { AbstractEdge } from "./AbstractEdge"

const InheritanceEdge = (props: EdgeProps) => {
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