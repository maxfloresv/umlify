import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

import useGlobalContext from "../hooks/useGlobalContext";
import UMLNode from "../model/UMLNode";
import Trait from "../model/Trait";

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

function NodeModal({ ctx }: { ctx: ReturnType<typeof useGlobalContext> }) {
  return (
    <Modal
      open={ctx.openNodeModal}
      onClose={() => ctx.setOpenNodeModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Añadiendo un nuevo trait
        </Typography>
        <div style={{ padding: '0 10px 0 0' }}>
          <TextField
            required
            onChange={(e) => ctx.updateNameNodeOperator(e.target.value)}
            id="std-required"
            label="Nombre"
            variant="standard"
          />
        </div>

        <div style={{ width: '100%', alignItems: 'right' }}>
          <Button onClick={() => {
            // TODO: handle the ids...
            const newNode: UMLNode = new Trait(
              Math.floor(Math.random() * 99999),
              ctx.nameNodeOperator,
              ctx.methodsNodeOperator,
              ctx.fieldsNodeOperator,
              ctx.relativeMouseCoordinate.x,
              ctx.relativeMouseCoordinate.y
            );
            ctx.setNodes((prevNodes) => [...prevNodes, newNode]);
            // This node is no longer a "new node", so we delete it from the context.
            ctx.setAddingNode(null); // is this necessary? no.
            ctx.setOpenNodeModal(false)
          }}>
            Guardar y cerrar
          </Button>
        </div>
      </Box>
    </Modal>
  );
}

export default NodeModal;