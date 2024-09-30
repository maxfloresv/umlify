import { Modal, Box, Typography, TextField, Button } from "@mui/material";

import useGlobalContext from "../hooks/useGlobalContext";
import UMLNode from "../model/UMLNode";
import Trait from "../model/Trait";
import ConcreteClass from "../model/ConcreteClass";
import AbstractClass from "../model/AbstractClass";

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

type TranslateKeys = {
  "trait": string,
  "abstractClass": string,
  "concreteClass": string
};

const TRANSLATION_KEYS: TranslateKeys = {
  "trait": "Trait",
  "abstractClass": "Abstract Class",
  "concreteClass": "Concrete Class"
};

interface NodeModalProps {
  ctx: ReturnType<typeof useGlobalContext>;
  type: string | null;
}

const NodeModal: React.FC<NodeModalProps> = ({ ctx, type }) => {
  // A type must be provided
  if (!type)
    return <></>;

  let translatedType: string = TRANSLATION_KEYS[type as keyof TranslateKeys];

  return (
    <Modal
      open={ctx.openNodeModal}
      onClose={() => ctx.setOpenNodeModal(false)}
      aria-labelledby="modal-class-title"
      aria-describedby="modal-class-description"
    >
      <Box sx={style}>
        <Typography id="modal-typography-title" variant="h6" component="h2">
          Adding a new node of type {translatedType}
        </Typography>
        <div style={{ padding: '0 10px 0 0' }}>
          <TextField
            required
            onChange={(e) => ctx.updateNameNodeOperator(e.target.value)}
            id="std-required"
            label="Name"
            variant="standard"
          />
        </div>

        <div style={{ width: '100%', alignItems: 'right' }}>
          <Button onClick={() => {
            let newNode: UMLNode | null = null;
            switch (type) {
              case "trait":
                newNode = new Trait(
                  ctx.generateNodeId(),
                  ctx.nameNodeOperator,
                  ctx.methodsNodeOperator,
                  ctx.fieldsNodeOperator,
                  ctx.relativeMouseCoordinate.x,
                  ctx.relativeMouseCoordinate.y
                );
                break;
              case "abstractClass":
                newNode = new AbstractClass(
                  ctx.generateNodeId(),
                  ctx.nameNodeOperator,
                  ctx.methodsNodeOperator,
                  ctx.fieldsNodeOperator,
                  ctx.relativeMouseCoordinate.x,
                  ctx.relativeMouseCoordinate.y
                );
                break;
              case "concreteClass":
                newNode = new ConcreteClass(
                  ctx.generateNodeId(),
                  ctx.nameNodeOperator,
                  ctx.methodsNodeOperator,
                  ctx.fieldsNodeOperator,
                  ctx.relativeMouseCoordinate.x,
                  ctx.relativeMouseCoordinate.y
                );
                break;
            }
            if (newNode) {
              ctx.setNodes((prevNodes) => [...prevNodes, newNode as UMLNode]);
            }
            ctx.setOpenNodeModal(false);
          }}>
            Save and close
          </Button>
        </div>
      </Box>
    </Modal>
  );
}

export default NodeModal;