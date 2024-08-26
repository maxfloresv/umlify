import { Handle, Position } from '@xyflow/react';
import "./css/paragraph.css";

function StyledNode({ data }) {
  return (
    <>
      <Handle type="target" position={Position.Top} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ border: '1px solid black', width: '100%' }}>
          {data.additionalText && data.additionalText.length > 0 && <p style={{ textAlign: 'center' }}>{data.additionalText}</p>}
          <p className={data.styleClass}>{data.name}</p>
        </div>
        <div style={{ border: '1px solid black', width: '100%' }}>
          {Object.keys(data.attributes).map((privacy) => {
            const array = data.attributes[privacy];
            switch (privacy) {
              case 'public':
                return array.map((publicAttr) => {
                  let [entry] = Object.entries(publicAttr);
                  let [attribute, type] = entry;
                  return <p key={attribute}>+ {attribute}: {type}</p>;
                });
              case 'protected':
                return array.map((protectedAttr) => {
                  let [entry] = Object.entries(protectedAttr);
                  let [attribute, type] = entry;
                  return <p key={attribute}># {attribute}: {type}</p>;
                })
              case 'private':
                return array.map((privateAttr) => {
                  let [entry] = Object.entries(privateAttr);
                  let [attribute, type] = entry;
                  return <p key={attribute}>- {attribute}: {type}</p>;
                })
              default:
                return null;
            }
          })}
        </div>
        <div style={{ border: '1px solid black', width: '100%' }}>
          {/* TODO: Agregar de alguna forma que se vean los parámetros que recibe y sus tipos... Esto se debe handlear en la propiedad data */}
          {Object.keys(data.methods).map((privacy) => {
            const array = data.methods[privacy];
            switch (privacy) {
              case 'public':
                return array.map((publicMethod) => {
                  let [entry] = Object.entries(publicMethod);
                  let [method, type] = entry;
                  return <p key={method}>+ {method}(): {type}</p>;
                });
              case 'protected':
                return array.map((protectedMethod) => {
                  let [entry] = Object.entries(protectedMethod);
                  let [method, type] = entry;
                  return <p key={method}># {method}(): {type}</p>;
                })
              case 'private':
                return array.map((privateMethod) => {
                  let [entry] = Object.entries(privateMethod);
                  let [method, type] = entry;
                  return <p key={method}>- {method}(): {type}</p>;
                })
              default:
                return null;
            }
          })}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} id="a" />
    </>
  );
}

export default StyledNode;