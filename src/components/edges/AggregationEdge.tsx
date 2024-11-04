import { EdgeProps } from "@xyflow/react";
import { AbstractEdge } from "./AbstractEdge"

const AggregationEdge = (props: EdgeProps) => {
  return (
    <AbstractEdge
      {...props}
      isDashed={false}
      markerFilled={false}
      markerType="diamond"
    />
  )
}

export default AggregationEdge;