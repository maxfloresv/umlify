import { Node } from "@xyflow/react";
import UMLAbstractClass from "./UMLAbstractClass";
import { CustomNodeData, FieldType, MethodType } from "./UMLNode";

class AbstractClass extends UMLAbstractClass {
  node: Node<CustomNodeData, "abstractClass">;

  constructor(
    id: number,
    name: string,
    methods: MethodType[],
    fields: FieldType[],
    x: number,
    y: number
  ) {
    super(id, name, methods, fields, x, y);
    this.name = name;
    this.id = id;
    this.methods = methods;
    this.fields = fields;
    this.node = {
      id: String(this.id),
      type: "abstractClass",
      position: { x: this.x, y: this.y },
      data: {
        id: this.id,
        name: this.name,
        methods: this.methods,
        fields: this.fields,
        styleClass: "abstract-paragraph",
        additionalText: null,
        editMode: false
      },
    };
  }
}

export default AbstractClass;
