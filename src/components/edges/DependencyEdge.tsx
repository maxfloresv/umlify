import { EdgeProps } from "@xyflow/react";
import { AbstractEdge } from "./AbstractEdge"

const DependencyEdge = (props: EdgeProps) => {
  return (
    <AbstractEdge
      {...props}
      isDashed={true}
      markerType="hat"
    />
  )
}

export default DependencyEdge;