import { Node } from "@xyflow/react";

export type Type = string;
export type Visibility = "public" | "protected" | "private";
export type ClassType = "trait" | "concreteClass" | "abstractClass";

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
export type CustomNodeData = {
  // Allows to identify the node when editing. It's not redundant, because
  // when editing we only can see the node data...
  id: number;
  name: string;
  methods: MethodType[];
  fields: FieldType[];
  styleClass: string;
  additionalText: string | null;
  editMode: boolean;
}

export type CustomNode = Node<CustomNodeData, ClassType>;

export default interface UMLNode {
  id: number;
  name: string;
  methods: MethodType[];
  fields: FieldType[];
  addExtends: (c: UMLNode) => void;
  removeExtends: (c: UMLNode) => void;
  node: Node;
  getNode: () => Node;
  // This is a library-dependant (@xy/react) method.
  updatePosition: (n: Node) => void;
  updateName: (s: string) => void;
  updateEditMode: (b: boolean) => void;
  updateField: (f: FieldType, newField: FieldType) => void;
  addField: (f: FieldType) => void;
  removeField: (f: FieldType) => void;
}
