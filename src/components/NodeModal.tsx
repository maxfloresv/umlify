import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

import useNode from "../hooks/useNodeOperator";
import useGlobalContext from "../hooks/useGlobalContext";

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
          Añadiendo un nodo de tipo T
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

        <div style={{ padding: '10px 0' }}>
          <Typography variant="subtitle1">
            Campos
          </Typography>
          <Button disabled variant="text" startIcon={<AddIcon />}>
            Añadir nuevo campo
          </Button>
        </div>

        <div style={{ padding: '10px 0' }}>
          <Typography variant="subtitle1">
            Métodos
          </Typography>
          <Button disabled variant="text" startIcon={<AddIcon />}>
            Añadir nuevo método
          </Button>
        </div>

        <div style={{ width: '100%', alignItems: 'right' }}>
          <Button onClick={() => ctx.setOpenNodeModal(false)}>
            Guardar y cerrar
          </Button>
        </div>
      </Box>
    </Modal>
  );
}

export default NodeModal;