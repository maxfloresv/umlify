import { Node } from "@xyflow/react";
import UMLAbstractClass from "./UMLAbstractClass";
import { CustomNodeData, FieldType, MethodType } from "./UMLNode";

class Trait extends UMLAbstractClass {
  node: Node<CustomNodeData, "trait">;

  constructor(
    id: number,
    name: string,
    methods: MethodType[],
    fields: FieldType[],
    x: number,
    y: number
  ) {
    super(id, name, methods, fields, x, y);
    this.node = {
      id: String(this.id),
      type: "trait",
      position: { x: this.x, y: this.y },
      data: {
        name: this.name,
        methods: this.methods,
        fields: this.fields,
        styleClass: "trait-paragraph",
        additionalText: "«interface»",
      },
    };
  }
}

export default Trait;
