import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import "./css/paragraph.css";
import "./css/containers.css";
import { FieldType, MethodType, Visibility } from "../model/UMLNode";
import type { CustomNodeData } from "../model/UMLNode";

import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { IconButton, TextField, Accordion, AccordionSummary, AccordionDetails, Typography, Button } from "@mui/material";

import { useState } from "react";

type ClassType = "trait" | "concreteClass" | "abstractClass";
type CustomNode = Node<CustomNodeData, ClassType>;

function StyledNode({ data }: NodeProps<CustomNode>) {
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

  // TODO: This can't be moved to ctx?
  const [editMode, setEditMode] = useState<boolean>(false);

  return (
    <>
      <Handle type="target" position={Position.Top} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          backgroundColor: "white",
          minWidth: "200px",
        }}
      >
        <div style={{ border: "1px solid black", width: "100%" }}>
          {data.additionalText && data.additionalText.length > 0 && (
            <p style={{ textAlign: "center" }}>{data.additionalText}</p>
          )}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {!editMode ?
              <p className={data.styleClass}>{data.name}</p> :
              <TextField
                id="standard-basic"
                label="Nombre"
                variant="standard"
                defaultValue={data.name}
              //onChange={(e) => data.setName(e.target.value)}
              />
            }
            <IconButton onClick={() => setEditMode(true)}>
              <EditIcon />
            </IconButton>
            {editMode && <IconButton onClick={() => setEditMode(false)}>
              <SaveIcon />
            </IconButton>}
          </div>
        </div>

        <div className="field-container">
          {!editMode ?
            data.fields.map((field: FieldType) => {
              return (
                <p key={field.name}>
                  {drawVisibility(field.visibility)} {field.name}: {field.type}
                </p>
              );
            }) :
            <>
              <Button variant="text">Añadir campo</Button>
              {data.fields.map((field: FieldType, i: number) => {
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
            data.methods.map((method: MethodType) => {
              return (
                <p key={method.name}>
                  {drawVisibility(method.visibility)} {method.name}
                  {"("}
                  {method.domType.map((t) => t).join(", ")}
                  {")"}
                  {method.codType ? ": " + method.codType : ""}
                </p>
              );
            }) :
            <>
              <Button variant="text">Añadir método</Button>
              {data.methods.map((method: MethodType, i: number) => {
                return (
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ArrowDownwardIcon />}
                      aria-controls={`panel${i}-content`}
                      id={`panel${i}-header`}
                    >
                      <Typography>{drawVisibility(method.visibility)} {method.name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>
                        <p key={method.name}>
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
