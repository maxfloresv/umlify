import { useState } from "react";
import UMLNode from "../model/UMLNode";

type A = {

};

const useAddingNodeModal = () => {
  /** Whether the user has opened the node modal (i.e. clicked an option when right-clicked). */
  const [editMode, setEditMode] = useState<boolean>(false);
  const [openNodeModal, setOpenNodeModal] = useState<boolean>(false);
  /** The node that is being constructed by the user. */
  const [addingNode, setAddingNode] = useState<UMLNode | null>();

  return {
    openNodeModal,
    setOpenNodeModal,
    addingNode,
    setAddingNode,
    editMode,
    setEditMode
  };
};

export default useAddingNodeModal;