import { Node } from "@xyflow/react";
import UMLNode from "./UMLNode";

abstract class UMLAbstractClass implements UMLNode {
  abstract id: number;
  abstract name: string;
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

  getNode: () => Node = () => {
    return {
      id: String(this.id),
      position: { x: this.x, y: this.y },
      data: { label: `Nodo ${this.id}` },
    };
  };
}

export default UMLAbstractClass;
