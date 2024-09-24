import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import "./css/paragraph.css";
import "./css/containers.css";
import UMLNode, { FieldType, MethodType, Visibility } from "../model/UMLNode";
import type { CustomNodeData } from "../model/UMLNode";

import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { IconButton, TextField, Accordion, AccordionSummary, AccordionDetails, Typography, Button } from "@mui/material";

import { useEffect, useState } from "react";
import useGlobalContext from "../hooks/useGlobalContext";

type ClassType = "trait" | "concreteClass" | "abstractClass";
type CustomNode = Node<CustomNodeData, ClassType>;

type StyledNodeProps = {
  nodeList: UMLNode[];
  node: NodeProps<CustomNode>;
};

// TODO: fix this with the correct type
const StyledNode = (props: StyledNodeProps) => {
  const { nodeList, node } = props;
  const { data } = node;

  const [editMode, setEditMode] = useState<boolean>(false);
  const [currentFields, setCurrentFields] = useState<FieldType[]>(data.fields);

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

  return (
    <>
      <Handle type="target" position={Position.Top} />

      <div className="box-container">
        <div className="title-container">
          {data.additionalText && data.additionalText.length > 0 && (
            <p className="additional-text-paragraph">{data.additionalText}</p>
          )}
          {!editMode ?
            <p className={data.styleClass}>{data.name}</p> :
            <TextField
              id="standard-basic"
              label="Name"
              variant="standard"
              defaultValue={data.name}
              className="nodrag"
              onChange={(e) => {
                const [retrievedNode] = nodeList.filter((n: UMLNode) => n.id === data.id);
                retrievedNode.updateName(e.target.value);
              }}
            />
          }
          <div style={{ position: "absolute", top: 0, right: 0 }}>
            {editMode ? <IconButton onClick={() => setEditMode(false)}>
              <SaveIcon />
            </IconButton> :
              <IconButton onClick={() => setEditMode(true)}>
                <EditIcon />
              </IconButton>}
          </div>
        </div>

        <div className="field-container">
          {!editMode ?
            currentFields.map((field: FieldType, id: number) => {
              return (
                <p key={id}>
                  {drawVisibility(field.visibility)} {field.name}: {field.type}
                </p>
              );
            }) :
            <>
              <Button onClick={() => {
                const [retrievedNode] = nodeList.filter((n: UMLNode) => n.id === data.id);
                const newField: FieldType = {
                  name: "newField",
                  type: "String",
                  visibility: "public"
                };

                retrievedNode.addField(newField);
                setCurrentFields(data.fields);
              }} variant="text">Add field</Button>

              {currentFields.map((field: FieldType, i: number) => {
                return (
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ArrowDownwardIcon />}
                      aria-controls={`panel${i}-content`}
                      id={`panel${i}-header`}
                    >
                      <Typography>{drawVisibility(field.visibility)} {field.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        {drawVisibility(field.visibility)} {field.name}: {field.type}
                      </Typography>
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
                <p key={id}>
                  {drawVisibility(method.visibility)} {method.name}
                  {"("}
                  {method.domType.map((t) => t).join(", ")}
                  {")"}
                  {method.codType ? ": " + method.codType : ""}
                </p>
              );
            }) :
            <>
              <Button variant="text">Add method</Button>
              {data.methods.map((method: MethodType, id: number) => {
                return (
                  <Accordion>
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

      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
}

export default StyledNode;
