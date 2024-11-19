import { Node } from "@xyflow/react";
import UMLNode, { EdgeType, FieldType, MethodType } from "./UMLNode";
import Trait from "./Trait";
import AbstractClass from "./AbstractClass";
import ConcreteClass from "./ConcreteClass";

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
  }

  removeExtends: (c: UMLNode) => void = (c) => {
    this.extends = this.extends.filter((e) => e.id !== c.id);
  }

  getNode: () => Node = () => this.node;

  updatePosition: (newNode: Node) => void = (newNode) => {
    this.x = newNode.position.x;
    this.y = newNode.position.y;

    this.node = newNode;
  }

  updateName: (newName: string) => void = (newName) => {
    this.name = newName;
    this.node.data.name = newName;
  }

  getName: () => string = () => this.name;

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

  getFields: () => FieldType[] = () => this.fields;

  addMethod: (m: MethodType) => void = (m) => {
    this.methods.push(m);
    this.node.data.methods = this.methods;
  }

  removeMethod: (m: MethodType) => void = (m) => {
    this.methods = this.methods.filter((method) => method.name !== m.name);
    this.node.data.methods = this.methods;
  }

  updateMethod: (m: MethodType, newMethod: MethodType) => void = (m, newMethod) => {
    const index = this.methods.findIndex((method) => method.name === m.name);
    this.methods[index] = newMethod;
    this.node.data.methods = this.methods;
  }

  getMethods: () => MethodType[] = () => this.methods;

  abstract getEdgeType: (target: UMLNode) => EdgeType;
  abstract traitEdgeType: (trait: Trait) => EdgeType;
  abstract abstractClassEdgeType: (abstractClass: AbstractClass) => EdgeType;
  abstract concreteClassEdgeType: (concreteClass: ConcreteClass) => EdgeType;
}

export default UMLAbstractClass;
