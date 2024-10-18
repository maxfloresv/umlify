import { Dispatch, SetStateAction, useEffect, useState, useRef } from "react";
import { Handle, NodeProps, Position } from "@xyflow/react";
import "./css/paragraph.css";
import "./css/containers.css";
import UMLNode, { CustomNode, FieldType, MethodType, Type, Visibility } from "../model/UMLNode";

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
  Tooltip,
  Autocomplete,
  Chip,
  FormGroup,
  FormControlLabel,
  Checkbox
} from "@mui/material";

import Trait from "../model/Trait";
import AbstractClass from "../model/AbstractClass";
import ConcreteClass from "../model/ConcreteClass";

type StyledNodeProps = {
  setNodes: Dispatch<SetStateAction<UMLNode[]>>;
  node: NodeProps<CustomNode>;
};

const StyledNode = (props: StyledNodeProps) => {
  const { setNodes, node } = props;
  const { data } = node;

  const [editMode, setEditMode] = useState<boolean>(false);
  // Allows forcing rerenders in this component.
  const [lastChange, setLastChange] = useState<Date | null>(null);
  // Set what panel is expanded.
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

  const forceUpdate = () => {
    setLastChange(new Date());
  }

  // Desired behaviour: this should be called every time the user right-clicks on the node
  // THIS IS A TODO
  useEffect(() => {
    function handleContextMenu(e: MouseEvent) {
      //.setIsMenuContextActive(false);
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
      <div ref={nodeRef} style={{ maxWidth: "425px" }}>
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
                      setNodes((oldNodes) => {
                        const [retrievedNode] = oldNodes.filter((n: UMLNode) => n.id === data.id);
                        retrievedNode.updateName(e.target.value);
                        return [...oldNodes];
                      });
                      forceUpdate();
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

                        setNodes((oldNodes) => {
                          const currentIndex = oldNodes.findIndex((n) => n.id === data.id);
                          // Only proceeds if the node is found
                          if (currentIndex !== -1 && newNode) {
                            oldNodes[currentIndex] = newNode;
                          }

                          return [...oldNodes];
                        });
                        forceUpdate();
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
              node.data.fields.map((field: FieldType, id: number) => (
                <p key={`field-${field.name}-${id}-${data.name}`}>
                  {drawVisibility(field.visibility)} {field.name}: {field.type}
                </p>
              )) :
              <>
                <Button onClick={() => {
                  setNodes((oldNodes) => {
                    return oldNodes.map((node: UMLNode) => {
                      if (node.id === data.id) {
                        // Placeholder
                        const newField: FieldType = {
                          name: "",
                          type: "",
                          visibility: "public"
                        };

                        node.addField(newField);
                      }

                      return node;
                    });
                  });
                  forceUpdate();
                }} variant="text" startIcon={<AddIcon />}>Add field</Button>

                {node.data.fields.map((field: FieldType, i: number) => {
                  return (
                    <Accordion
                      expanded={expanded === `panel-fields${i}`}
                      onChange={handlePanelChange(`panel-fields${i}`)}
                    >
                      <Box sx={{ display: "flex", minWidth: "100%" }}>
                        <div style={{ width: "100%" }}>
                          <AccordionSummary
                            expandIcon={<ArrowDownwardIcon />}
                            aria-controls={`panel-fields-${i}-content`}
                            id={`panel-fields-${i}-header`}
                          >
                            <Typography>{drawVisibility(field.visibility)} {field.name}: {field.type}</Typography>
                          </AccordionSummary>
                        </div>

                        <div style={{ width: "fit-content", alignContent: "center" }}>
                          <IconButton onClick={() => {
                            setNodes((oldNodes) => {
                              const [retrievedNode] = oldNodes.filter((n: UMLNode) => n.id === data.id);
                              retrievedNode.removeField(field);
                              return [...oldNodes];
                            });
                            forceUpdate();
                          }}>
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      </Box>

                      <AccordionDetails>
                        <div className="two-cols-container">
                          <TextField
                            id={`field-${i}-name`}
                            label="Field Name"
                            variant="standard"
                            defaultValue={field.name}
                            onChange={(e) => {
                              setNodes((oldNodes) => {
                                const [retrievedNode] = oldNodes.filter((n: UMLNode) => n.id === data.id);
                                const fieldToUpdate = data.fields.find((f) => f.name === field.name);

                                if (!fieldToUpdate) {
                                  return oldNodes;
                                }

                                retrievedNode.updateField(fieldToUpdate, { ...fieldToUpdate, name: e.target.value });
                                return [...oldNodes];
                              });
                              forceUpdate();
                            }}
                          />

                          <TextField
                            id={`field-${i}-type`}
                            label="Field Type"
                            variant="standard"
                            defaultValue={field.type}
                            onChange={(e) => {
                              setNodes((oldNodes) => {
                                const [retrievedNode] = oldNodes.filter((n: UMLNode) => n.id === data.id);
                                const fieldToUpdate = data.fields.find((f) => f.name === field.name);

                                if (!fieldToUpdate) {
                                  return oldNodes;
                                }

                                retrievedNode.updateField(fieldToUpdate, { ...fieldToUpdate, type: e.target.value });
                                return [...oldNodes];
                              });
                              forceUpdate();
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
                              setNodes((oldNodes) => {
                                const [retrievedNode] = oldNodes.filter((n: UMLNode) => n.id === data.id);
                                const fieldToUpdate = data.fields.find((f) => f.name === field.name);

                                if (!fieldToUpdate) {
                                  return oldNodes;
                                }

                                retrievedNode.updateField(fieldToUpdate,
                                  { ...fieldToUpdate, visibility: e.target.value as Visibility });
                                return [...oldNodes];
                              });
                              forceUpdate();
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
                    {"): "}
                    {method.codType ? method.codType : "Unit"}
                  </p>
                );
              }) :
              <>
                <Button onClick={() => {
                  setNodes((oldNodes) => {
                    return oldNodes.map((node: UMLNode) => {
                      if (node.id === data.id) {
                        // Placeholder
                        const newMethod: MethodType = {
                          name: "",
                          domType: [],
                          codType: "",
                          visibility: "public",
                          abstract: false
                        };

                        node.addMethod(newMethod);
                      }

                      return node;
                    });
                  });
                  forceUpdate();
                }} variant="text" startIcon={<AddIcon />}>Add method</Button>

                {node.data.methods.map((method: MethodType, i: number) => {
                  return (
                    <Accordion
                      expanded={expanded === `panel-methods${i}`}
                      onChange={handlePanelChange(`panel-methods${i}`)}
                    >
                      <Box sx={{ display: "flex", minWidth: "100%" }}>
                        <div style={{ width: "100%" }}>
                          <AccordionSummary
                            expandIcon={<ArrowDownwardIcon />}
                            aria-controls={`panel-methods-${i}-content`}
                            id={`panel-methods-${i}-header`}
                          >
                            <Typography>
                              {drawVisibility(method.visibility)} {method.name}
                              {"("}
                              {method.domType.map((t) => t).join(", ")}
                              {"): "}
                              {method.codType ? method.codType : "Unit"}
                            </Typography>
                          </AccordionSummary>
                        </div>

                        <div style={{ width: "fit-content", alignContent: "center" }}>
                          <IconButton onClick={() => {
                            setNodes((oldNodes) => {
                              const [retrievedNode] = oldNodes.filter((n: UMLNode) => n.id === data.id);
                              retrievedNode.removeMethod(method);
                              return [...oldNodes];
                            });
                            forceUpdate();
                          }}>
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      </Box>

                      <AccordionDetails>
                        <div className="two-cols-container">
                          <TextField
                            id={`method-${i}-name`}
                            label="Method Name"
                            variant="standard"
                            defaultValue={method.name}
                            onChange={(e) => {
                              setNodes((oldNodes) => {
                                const [retrievedNode] = oldNodes.filter((n: UMLNode) => n.id === data.id);
                                const methodToUpdate = data.methods.find((m) => m.name === method.name);

                                if (!methodToUpdate) {
                                  return oldNodes;
                                }

                                retrievedNode.updateMethod(methodToUpdate, { ...methodToUpdate, name: e.target.value });
                                return [...oldNodes];
                              });
                              forceUpdate();
                            }}
                          />

                          <TextField
                            id={`method-${i}-codType`}
                            label="Method Codomain Type"
                            variant="standard"
                            defaultValue={method.codType}
                            onChange={(e) => {
                              setNodes((oldNodes) => {
                                const [retrievedNode] = oldNodes.filter((n: UMLNode) => n.id === data.id);
                                const methodToUpdate = data.methods.find((m) => m.name === method.name);

                                if (!methodToUpdate) {
                                  return oldNodes;
                                }

                                retrievedNode.updateMethod(methodToUpdate, { ...methodToUpdate, codType: e.target.value });
                                return [...oldNodes];
                              });
                              forceUpdate();
                            }}
                          />
                        </div>

                        <Autocomplete
                          sx={{ maxWidth: 'inherit', marginBottom: "20px" }}
                          multiple
                          id="method-tags-standard"
                          options={[]}
                          value={method.domType}
                          freeSolo
                          onChange={(_, newValue: readonly string[]) => {
                            if (newValue && newValue.length >= 0) {
                              setNodes((oldNodes) => {
                                const [retrievedNode] = oldNodes.filter((n: UMLNode) => n.id === data.id);
                                const methodToUpdate = data.methods.find((m) => m.name === method.name);

                                if (!methodToUpdate) {
                                  return oldNodes;
                                }

                                // As newValue is read-only, we pass an array copy
                                const newDomType: Type[] = [...newValue];
                                retrievedNode.updateMethod(methodToUpdate,
                                  { ...methodToUpdate, domType: newDomType });
                                return [...oldNodes];
                              });
                              forceUpdate();
                            }
                          }}
                          renderTags={(value: readonly string[], getTagProps) =>
                            value.map((option: string, index: number) => {
                              const { key, ...tagProps } = getTagProps({ index });
                              return (
                                <Chip variant="outlined" label={option} key={key} {...tagProps} />
                              );
                            })
                          }
                          renderInput={(params) => {
                            return (
                              <TextField
                                {...params}
                                variant="standard"
                                label="Method Domain Type(s)"
                                placeholder="Type and press Enter"
                              />
                            )
                          }}
                        />

                        <div className="two-cols-container" style={{ marginBottom: 0 }}>
                          <FormControl fullWidth>
                            <InputLabel id={`method-${i}-visibility`}>Visibility</InputLabel>
                            <Select
                              labelId={`method-${i}-visibility`}
                              id={`method-${i}-visibility-select`}
                              sx={{ overflow: "visible", zIndex: 9999 }}
                              value={method.visibility}
                              label="Visibility"
                              onChange={(e) => {
                                setNodes((oldNodes) => {
                                  const [retrievedNode] = oldNodes.filter((n: UMLNode) => n.id === data.id);
                                  const methodToUpdate = data.methods.find((m) => m.name === method.name);

                                  if (!methodToUpdate) {
                                    return oldNodes;
                                  }

                                  retrievedNode.updateMethod(methodToUpdate,
                                    { ...methodToUpdate, visibility: e.target.value as Visibility });
                                  return [...oldNodes];
                                });
                                forceUpdate();
                              }}
                            >
                              <MenuItem value={"public"}>Public</MenuItem>
                              <MenuItem value={"protected"}>Protected</MenuItem>
                              <MenuItem value={"private"}>Private</MenuItem>
                            </Select>
                          </FormControl>

                          <FormGroup>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={method.abstract}
                                  onChange={(_) => {
                                    setNodes((oldNodes) => {
                                      const [retrievedNode] = oldNodes.filter((n: UMLNode) => n.id === data.id);
                                      const methodToUpdate = data.methods.find((m) => m.name === method.name);

                                      if (!methodToUpdate) {
                                        return oldNodes;
                                      }

                                      retrievedNode.updateMethod(methodToUpdate,
                                        { ...methodToUpdate, abstract: !method.abstract });
                                      return [...oldNodes];
                                    });
                                    forceUpdate();
                                  }}
                                />
                              }
                              label="Abstract?"
                            />
                          </FormGroup>
                        </div>
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
