import { Node } from "@xyflow/react";

export default interface UMLNode {
  id: number;
  name: string;
  methods: Object;
  attributes: Object;
  addExtends: (c: UMLNode) => void;
  removeExtends: (c: UMLNode) => void;
  node: Node;
  getNode: () => Node;
  updateNode: (n: Node) => void;
}
