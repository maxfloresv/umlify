import { Node } from "@xyflow/react";
import UMLNode, { CustomNodeData, FieldType, MethodType } from "./UMLNode";

abstract class UMLAbstractClass implements UMLNode {
  id: number;
  name: string;
  abstract node: Node;
  methods: MethodType[];
  fields: FieldType[];
  protected extends: UMLNode[] = [];
  x: number;
  y: number;

  constructor(
    id: number,
    name: string,
    methods: MethodType[],
    fields: FieldType[],
    x: number,
    y: number
  ) {
    this.name = name;
    this.id = id;
    this.methods = methods;
    this.fields = fields;
    this.x = x;
    this.y = y;
  }

  addExtends: (c: UMLNode) => void = (c) => {
    this.extends.push(c);
  };

  removeExtends: (c: UMLNode) => void = (c) => {
    this.extends = this.extends.filter((e) => e.id !== c.id);
  };

  getNode: () => Node = () => this.node;
  updatePosition: (newNode: Node) => void = (newNode) => {
    this.x = newNode.position.x;
    this.y = newNode.position.y;

    this.node = newNode;
  };
  updateName: (newName: string) => void = (newName) => {
    this.name = newName;
    this.node.data.name = newName;
  }
  updateEditMode: (newStatus: boolean) => void = (newStatus) => {
    this.node.data.editMode = newStatus;
  }
  addField: (f: FieldType) => void = (f) => {
    this.fields.push(f);
    this.node.data.fields = this.fields;
  }
  removeField: (f: FieldType) => void = (f) => {
    this.fields = this.fields.filter((field) => field.name !== f.name);
    this.node.data.fields = this.fields;
  }
  updateField: (f: FieldType, newField: FieldType) => void = (f, newField) => {
    const index = this.fields.findIndex((field) => field.name === f.name);
    this.fields[index] = newField;
    this.node.data.fields = this.fields;
  }
}

export default UMLAbstractClass;
