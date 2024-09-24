import { Node } from "@xyflow/react";
import UMLAbstractClass from "./UMLAbstractClass";
import { CustomNodeData, FieldType, MethodType } from "./UMLNode";

class ConcreteClass extends UMLAbstractClass {
  node: Node<CustomNodeData, "concreteClass">;

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
      type: "concreteClass",
      position: { x: this.x, y: this.y },
      data: {
        id: this.id,
        name: this.name,
        methods: this.methods,
        fields: this.fields,
        styleClass: "concrete-paragraph",
        additionalText: null,
        editMode: false
      },
    };
  }
}

export default ConcreteClass;
