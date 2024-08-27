import { Node } from "@xyflow/react";
import UMLNode, { FieldType, MethodType } from "./UMLNode";

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
  updateNode: (newNode: Node) => void = (newNode) => {
    this.x = newNode.position.x;
    this.y = newNode.position.y;
    this.node = newNode;
  };
}

export default UMLAbstractClass;
