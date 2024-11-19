import { Node } from "@xyflow/react";
import UMLAbstractClass from "./UMLAbstractClass";
import UMLNode, { CustomNodeData, EdgeType, FieldType, MethodType } from "./UMLNode";
import AbstractClass from "./AbstractClass";
import ConcreteClass from "./ConcreteClass";
import InvalidConnectionException from "../exceptions/InvalidConnectionException";

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
        id: this.id,
        name: this.name,
        methods: this.methods,
        fields: this.fields,
        styleClass: "trait-paragraph",
        additionalText: "«interface»",
        editMode: false
      },
    };
  }

  getEdgeType: (target: UMLNode) => EdgeType = (target) => {
    return target.traitEdgeType(this);
  }

  traitEdgeType: (_trait: Trait) => EdgeType = (_trait) => {
    return "implementation"
  }

  abstractClassEdgeType: (_abstractClass: AbstractClass) => EdgeType = (_abstractClass) => {
    return "implementation";
  }

  concreteClassEdgeType: (_concreteClass: ConcreteClass) => EdgeType = (_concreteClass) => {
    return "implementation";
  }
}

export default Trait;
