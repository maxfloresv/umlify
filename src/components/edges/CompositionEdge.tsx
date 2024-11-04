import { EdgeProps } from "@xyflow/react";
import { AbstractEdge } from "./AbstractEdge"

const CompositionEdge = (props: EdgeProps) => {
  return (
    <AbstractEdge
      {...props}
      isDashed={false}
      markerFilled={true}
      markerType="diamond"
    />
  )
}

export default CompositionEdge;