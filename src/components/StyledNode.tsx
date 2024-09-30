import { Dispatch, SetStateAction, useEffect, useState, useRef } from "react";
import { Handle, NodeProps, Position } from "@xyflow/react";
import "./css/paragraph.css";
import "./css/containers.css";
import UMLNode, { CustomNode, FieldType, MethodType, Visibility } from "../model/UMLNode";

import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import {
  IconButton,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Tooltip
} from "@mui/material";

import Trait from "../model/Trait";
import AbstractClass from "../model/AbstractClass";
import ConcreteClass from "../model/ConcreteClass";

type StyledNodeProps = {
  nodeList: UMLNode[];
  node: NodeProps<CustomNode>;
  // Actives or inactives the context
  contextMenuModifier: Dispatch<SetStateAction<boolean>>;
  setNodes: Dispatch<SetStateAction<UMLNode[]>>;
};

// TODO: fix this with the correct type
const StyledNode = (props: StyledNodeProps) => {
  const { nodeList, node, contextMenuModifier, setNodes } = props;
  const { data } = node;
  const setIsMenuContextActive = contextMenuModifier;

  const [editMode, setEditMode] = useState<boolean>(false);
  const [currentFields, setCurrentFields] = useState<FieldType[]>(data.fields);
  const [expanded, setExpanded] = useState<string | false>(false);

  const nodeRef = useRef<HTMLDivElement>(null);
  // Allows to control whether the user has right-clicked a node or not.
  // This is a state that alternates between true and false to force the rerender.
  const [rightClickedAlt, setRightClickedAlt] = useState<boolean>(false);

  const drawVisibility = (v: Visibility | null) => {
    switch (v) {
      case "public":
        return "+";
      case "protected":
        return "#";
      case "private":
        return "-";
      default:
        return "?";
    }
  };

  const handlePanelChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };

  // Desired behaviour: this should be called every time the user right-clicks on the node
  useEffect(() => {
    function handleContextMenu(e: MouseEvent) {
      setIsMenuContextActive(false);
      setRightClickedAlt((oldState) => !oldState);
    }

    const nodeElement = nodeRef.current;
    if (nodeElement) {
      nodeElement.addEventListener('contextmenu', handleContextMenu);

      // This is called when the dependency lastRightClicked changes
      return () => {
        nodeElement.removeEventListener('contextmenu', handleContextMenu);
      };
    }
  }, [rightClickedAlt]);

  return (
    <>
      <div ref={nodeRef}>
        <Handle type="target" position={Position.Top} id="top-edge" />

        <div className="box-container">
          <div className="title-container">
            {data.additionalText && data.additionalText.length > 0 && (
              <p className="additional-text-paragraph">{data.additionalText}</p>
            )}
            {!editMode ?
              <p className={data.styleClass}>{data.name}</p> :
              <>
                <div className="name-type-edit-container">
                  <TextField
                    id="class-text-name"
                    sx={{ width: "100%" }}
                    label="Class Name"
                    variant="standard"
                    defaultValue={data.name}
                    onChange={(e) => {
                      const [retrievedNode] = nodeList.filter((n: UMLNode) => n.id === data.id);
                      retrievedNode.updateName(e.target.value);
                    }}
                  />

                  <FormControl variant="standard" fullWidth>
                    <InputLabel id="input-change-type">Change Type</InputLabel>
                    <Select
                      labelId="label-change-type"
                      id="select-change-type"
                      sx={{ overflow: "visible", zIndex: 9999 }}
                      value={node.type}
                      label="Change Type"
                      onChange={(e) => {
                        if (e.target.value === node.type)
                          return;

                        let newNode: UMLNode | null = null;
                        switch (e.target.value) {
                          case "trait":
                            newNode = new Trait(
                              data.id,
                              data.name,
                              data.methods,
                              data.fields,
                              node.positionAbsoluteX,
                              node.positionAbsoluteY);
                            break;
                          case "abstractClass":
                            newNode = new AbstractClass(
                              data.id,
                              data.name,
                              data.methods,
                              data.fields,
                              node.positionAbsoluteX,
                              node.positionAbsoluteY);
                            break;
                          case "concreteClass":
                            newNode = new ConcreteClass(
                              data.id,
                              data.name,
                              data.methods,
                              data.fields,
                              node.positionAbsoluteX,
                              node.positionAbsoluteY);
                            break;
                        }

                        const currentIndex = nodeList.findIndex((n) => n.id === data.id);
                        // Only proceeds if the node is found
                        if (currentIndex !== -1 && newNode) {
                          nodeList[currentIndex] = newNode;
                        }

                        setNodes([...nodeList]);
                      }}
                    >
                      <MenuItem value={"trait"}>Trait</MenuItem>
                      <MenuItem value={"abstractClass"}>Abstract Class</MenuItem>
                      <MenuItem value={"concreteClass"}>Concrete Class</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </>
            }

            <div style={{ position: "absolute", top: 0, right: 0 }}>
              {editMode ?
                <Tooltip placement="top" title="Exit Edit mode" arrow>
                  <IconButton onClick={() => setEditMode(false)}>
                    <LogoutIcon />
                  </IconButton>
                </Tooltip> :
                <Tooltip placement="top" title="Enter Edit mode" arrow>
                  <IconButton onClick={() => setEditMode(true)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              }
            </div>
          </div>

          <div className="field-container">
            {!editMode ?
              currentFields.map((field: FieldType, id: number) => (
                <p key={`field-${field.name}-${id}`}>
                  {drawVisibility(field.visibility)} {field.name}: {field.type}
                </p>
              )) :
              <>
                <Button onClick={() => {
                  const [retrievedNode] = nodeList.filter((n: UMLNode) => n.id === data.id);
                  const newField: FieldType = {
                    name: "newField",
                    type: "String",
                    visibility: "public"
                  };

                  retrievedNode.addField(newField);
                  setCurrentFields([...data.fields]);
                }} variant="text" startIcon={<AddIcon />}>Add field</Button>

                {currentFields.map((field: FieldType, i: number) => {
                  return (
                    <Accordion
                      expanded={expanded === `panel-fields${i}`}
                      onChange={handlePanelChange(`panel-fields${i}`)}
                    >
                      <Box sx={{ display: "flex", minWidth: "100%" }}>
                        <div style={{ width: "100%" }}>
                          <AccordionSummary
                            expandIcon={<ArrowDownwardIcon />}
                            aria-controls={`panel${i}-content`}
                            id={`panel${i}-header`}
                          >
                            <Typography>{drawVisibility(field.visibility)} {field.name}: {field.type}</Typography>
                          </AccordionSummary>
                        </div>

                        <div style={{ width: "fit-content", alignContent: "center" }}>
                          <IconButton onClick={() => {
                            const [retrievedNode] = nodeList.filter((n: UMLNode) => n.id === data.id);
                            retrievedNode.removeField(field);
                            setCurrentFields([...data.fields]);
                          }}>
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      </Box>
                      <AccordionDetails>
                        <div className="field-text-edit-container">
                          <TextField
                            id={`field-${i}-name`}
                            label="Field Name"
                            variant="standard"
                            defaultValue={field.name}
                            onChange={(e) => {
                              const [retrievedNode] = nodeList.filter((n: UMLNode) => n.id === data.id);
                              const fieldToUpdate = data.fields.find((f) => f.name === field.name);

                              if (!fieldToUpdate) {
                                return;
                              }

                              retrievedNode.updateField(fieldToUpdate, { ...fieldToUpdate, name: e.target.value });
                              setCurrentFields([...data.fields]);
                            }}
                          />

                          <TextField
                            id={`field-${i}-type`}
                            label="Field Type"
                            variant="standard"
                            defaultValue={field.type}
                            onChange={(e) => {
                              const [retrievedNode] = nodeList.filter((n: UMLNode) => n.id === data.id);
                              const fieldToUpdate = data.fields.find((f) => f.name === field.name);

                              if (!fieldToUpdate) {
                                return;
                              }

                              retrievedNode.updateField(fieldToUpdate, { ...fieldToUpdate, type: e.target.value });
                              setCurrentFields([...data.fields]);
                            }}
                          />
                        </div>

                        <FormControl fullWidth>
                          <InputLabel id={`field-${i}-visibility`}>Visibility</InputLabel>
                          <Select
                            labelId={`field-${i}-visibility`}
                            id={`field-${i}-visibility-select`}
                            sx={{ overflow: "visible", zIndex: 9999 }}
                            value={field.visibility}
                            label="Visibility"
                            onChange={(e) => {
                              const [retrievedNode] = nodeList.filter((n: UMLNode) => n.id === data.id);
                              const fieldToUpdate = data.fields.find((f) => f.name === field.name);

                              if (!fieldToUpdate) {
                                return;
                              }

                              retrievedNode.updateField(fieldToUpdate, {
                                ...fieldToUpdate,
                                visibility: e.target.value as Visibility
                              });
                              setCurrentFields([...data.fields]);
                            }}
                          >
                            <MenuItem value={"public"}>Public</MenuItem>
                            <MenuItem value={"protected"}>Protected</MenuItem>
                            <MenuItem value={"private"}>Private</MenuItem>
                          </Select>
                        </FormControl>
                      </AccordionDetails>
                    </Accordion>
                  )
                })}
              </>
            }
          </div>

          <div className="method-container">
            {!editMode ?
              data.methods.map((method: MethodType, id: number) => {
                return (
                  <p key={`method-${method.name}-${id}`}>
                    {drawVisibility(method.visibility)} {method.name}
                    {"("}
                    {method.domType.map((t) => t).join(", ")}
                    {")"}
                    {method.codType ? ": " + method.codType : ""}
                  </p>
                );
              }) :
              <>
                <Button variant="text" startIcon={<AddIcon />}>Add method</Button>
                {data.methods.map((method: MethodType, id: number) => {
                  return (
                    <Accordion
                      expanded={expanded === `panel-methods${id}`}
                      onChange={handlePanelChange(`panel-methods${id}`)}
                    >
                      <AccordionSummary
                        expandIcon={<ArrowDownwardIcon />}
                        aria-controls={`panel${id}-content`}
                        id={`panel${id}-header`}
                      >
                        <Typography>{drawVisibility(method.visibility)} {method.name}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>
                          <p key={id}>
                            {drawVisibility(method.visibility)} {method.name}
                            {"("}
                            {method.domType.map((t) => t).join(", ")}
                            {")"}
                            {method.codType ? ": " + method.codType : ""}
                          </p>
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  )
                })}
              </>
            }
          </div>
        </div>

        <Handle type="source" position={Position.Bottom} id="bottom-edge" />
      </div>
    </>
  );
}

export default StyledNode;
