import { useState } from "react";
import { FieldType, MethodType } from "../model/UMLNode";

/** Operator Nodes are used when we apply CRUD operations in nodes. */
const useNodeOperator = () => {
  const [nameNodeOperator, setNameNodeOperator] = useState<string>("");
  const [fieldsNodeOperator, setFieldsNodeOperator] = useState<FieldType[]>([]);
  const [methodsNodeOperator, setMethodsNodeOperator] = useState<MethodType[]>([]);

  function updateNameNodeOperator(name: string) {
    setNameNodeOperator(name);
  }

  function addFieldNodeOperator(field: FieldType) {
    setFieldsNodeOperator([...fieldsNodeOperator, field]);
  }

  function removeFieldNodeOperator(field: FieldType) {
    setFieldsNodeOperator(fieldsNodeOperator.filter((f) => f.name !== field.name));
  }

  function addMethodNodeOperator(method: MethodType) {
    setMethodsNodeOperator([...methodsNodeOperator, method]);
  }

  function removeMethodNodeOperator(method: MethodType) {
    setMethodsNodeOperator(methodsNodeOperator.filter((m) => m.name !== method.name));
  }

  return {
    nameNodeOperator,
    fieldsNodeOperator,
    methodsNodeOperator,
    updateNameNodeOperator,
    addFieldNodeOperator,
    removeFieldNodeOperator,
    addMethodNodeOperator,
    removeMethodNodeOperator,
  };
};

export default useNodeOperator;