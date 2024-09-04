import { styled } from "@mui/system";

interface ContextMenuProps {
  top: number;
  left: number;
}

const ContextMenu = styled('div')<ContextMenuProps>(({ top, left }) => ({
  position: 'absolute',
  width: '200px',
  backgroundColor: '#383838',
  borderRadius: '5px',
  boxSizing: 'border-box',
  top: `${top}px`,
  left: `${left}px`,
  '& ul': {
    boxSizing: 'border-box',
    padding: '10px',
    margin: 0,
    listStyle: 'none',
  },
  '& ul li': {
    padding: '18px 12px'
  },
  '& ul li:hover': {
    cursor: 'pointer',
    backgroundColor: '#000000'
  }
}));

export default ContextMenu;