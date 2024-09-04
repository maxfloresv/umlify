import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import "./css/paragraph.css";
import { FieldType, MethodType, Visibility } from "../model/UMLNode";
import type { CustomNodeData } from "../model/UMLNode";

type ClassType = "trait" | "concreteClass" | "abstractClass";
type CustomNode = Node<CustomNodeData, ClassType>;

function StyledNode({ data }: NodeProps<CustomNode>) {
  const drawVisibility = (v: Visibility | null) => {
    switch (v) {
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

  return (
    <>
      <Handle type="target" position={Position.Top} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          backgroundColor: "white",
        }}
      >
        <div style={{ border: "1px solid black", width: "100%" }}>
          {data.additionalText && data.additionalText.length > 0 && (
            <p style={{ textAlign: "center" }}>{data.additionalText}</p>
          )}
          <p className={data.styleClass}>{data.name}</p>
        </div>

        <div style={{ border: "1px solid black", width: "100%" }}>
          {data.fields.map((field: FieldType) => {
            return (
              <p key={field.name}>
                {drawVisibility(field.visibility)} {field.name}: {field.type}
              </p>
            );
          })}
        </div>

        <div style={{ border: "1px solid black", width: "100%" }}>
          {data.methods.map((method: MethodType) => {
            return (
              <p key={method.name}>
                {drawVisibility(method.visibility)} {method.name}
                {"("}
                {method.domType.map((t) => t).join(", ")}
                {")"}
                {method.codType ? ": " + method.codType : ""}
              </p>
            );
          })}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
}

export default StyledNode;
