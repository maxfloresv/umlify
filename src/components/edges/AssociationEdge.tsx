import { EdgeProps } from "@xyflow/react";
import { AbstractEdge } from "./AbstractEdge"

const AssociationEdge = (props: EdgeProps) => {
  return (
    <AbstractEdge
      {...props}
      isDashed={false}
      markerType="hat"
    />
  )
}

export default AssociationEdge;