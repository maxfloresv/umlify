import { Node } from "@xyflow/react";

export type Type = string;
export type Visibility = "public" | "protected" | "private";
export interface MethodType {
  name: string;
  domType: Type[];
  codType: Type | null;
  visibility: Visibility | null;
  abstract: boolean;
}
export interface FieldType {
  name: string;
  type: Type;
  visibility: Visibility | null;
}

export default interface UMLNode {
  id: number;
  name: string;
  methods: MethodType[];
  fields: FieldType[];
  addExtends: (c: UMLNode) => void;
  removeExtends: (c: UMLNode) => void;
  node: Node;
  getNode: () => Node;
  updateNode: (n: Node) => void;
}
