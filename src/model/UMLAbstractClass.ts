import { Node } from "@xyflow/react";
import UMLNode from "./UMLNode";

abstract class UMLAbstractClass implements UMLNode {
  abstract id: number;
  abstract name: string;
  abstract node: Node;
  abstract methods: Object;
  abstract attributes: Object;
  protected extends: UMLNode[] = [];
  x: number;
  y: number;

  constructor(x: number, y: number) {
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
  }
}

export default UMLAbstractClass;
