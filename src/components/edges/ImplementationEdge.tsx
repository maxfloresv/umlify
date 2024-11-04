import { EdgeProps } from "@xyflow/react";
import { AbstractEdge } from "./AbstractEdge"

const ImplementationEdge = (props: EdgeProps) => {
  return (
    <AbstractEdge
      {...props}
      isDashed={true}
      markerFilled={false}
      markerType="triangle"
    />
  )
}

export default ImplementationEdge;