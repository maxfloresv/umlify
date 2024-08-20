import { Node } from "@xyflow/react";
import UMLAbstractClass from "./UMLAbstractClass";

class AbstractClass extends UMLAbstractClass {
  id: number;
  name: string;

  constructor(id: number, x: number, y: number) {
    super(x, y);
    this.name = "Foo";
    this.id = id;
  }
}

export default AbstractClass;
