import { Node } from "@xyflow/react";

export default interface UMLNode {
  id: number;
  name: string;
  addExtends: (c: UMLNode) => void;
  removeExtends: (c: UMLNode) => void;
  getNode: () => Node;
}
