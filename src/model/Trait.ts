import { Node } from "@xyflow/react";
import UMLAbstractClass from "./UMLAbstractClass";

class Trait extends UMLAbstractClass {
  id: number;
  name: string;
  methods: Object;
  attributes: Object;
  node: Node;

  constructor(id: number, name: string, methods: Object, attributes: Object, x: number, y: number) {
    super(x, y);
    this.name = name;
    this.id = id;
    this.methods = methods;
    this.attributes = attributes;
    this.node = {
      id: String(this.id),
      type: 'trait',
      position: { x: this.x, y: this.y },
      data: { 
        name: this.name, 
        methods: this.methods, 
        attributes: this.attributes,
        styleClass: 'trait-paragraph',
        additionalText: "«interface»"
      },
    };
  }
}

export default Trait;
