import React, { useEffect, useRef, useState } from "react";
import { Handle, Position } from "reactflow";
import styles from "./index.module.css";

const BlueprintNode = ({ data, id }) => {
  const { typeOfNode, nodeInfo } = data;
  const [currText, setCurrText] = useState(data?.text || "{{input}}");
  const [dynamicTargetHandleCount, setDynamicTargetHandleCount] = useState(0);
  const textareaRef = useRef();
  const pattern = /\{\{\w+\}\}/g;

  const addDynamicNode = (textareaValue) => {
    const matches = textareaValue.match(pattern);
    // console.log("currText & matches: ", textareaValue, matches);
    if (matches !== null) {
      setDynamicTargetHandleCount(matches.length);
    } else if (matches === null) {
      setDynamicTargetHandleCount(0);
    }
  };

  const handleTextChange = (e) => {
    const textareaElement = e.target;
    const currentText = e.target.value;
    console.log("ye hai event ka target: ", e.target);
    setCurrText(currentText);

    // adding target nodes on text change
    addDynamicNode(currentText);

    // adding auto-grow height with increasing text content
    textareaElement.style.height = "auto";
    textareaElement.style.height = textareaElement.scrollHeight + "px";
  };

  useEffect(() => {
    if (typeOfNode === "newText") {
      const textareaElement = textareaRef.current;
      textareaElement.setAttribute(
        "style",
        "height:" + textareaElement.scrollHeight + "px;overflow-y:hidden;"
      );
    }
  }, []);

  useEffect(() => {
    if (typeOfNode === "newText") {
      addDynamicNode(currText);
    }
  }, []);

  return (
    <div className={styles["container"]}>
      {typeOfNode === "newLlm" && (
        <Handle
          className={styles["target-handle"]}
          type="target"
          position={Position.Left}
          id={`${id}-system`}
          style={{ top: `${100 / 3}%` }}
        />
      )}
      {typeOfNode === "newLlm" && (
        <Handle
          className={styles["target-handle"]}
          type="target"
          position={Position.Left}
          id={`${id}-prompt`}
          style={{ top: `${200 / 3}%` }}
        />
      )}
      {typeOfNode === "newText" &&
        Array.from({ length: dynamicTargetHandleCount }).map((_, index) => (
          <Handle
            key={index}
            type="target"
            position={Position.Left}
            id={`handle-${index}`}
            className={styles["target-handle"]}
            style={{ top: 20 + index * 30 }}
          />
        ))}
      <div className={styles["heading"]}>
        <span>{typeOfNode}</span>
      </div>
      {/* {typeOfNode === "newLlm" && (
        <div className={styles["info"]}>
          <span>{nodeInfo}</span>
        </div>
      )} */}
      <div className={styles["info"]}>
        <span>{nodeInfo}</span>
      </div>
      {typeOfNode === "newText" && (
        <div className={styles["node-body"]}>
          <label className={styles["node-data"]}>
            <span>Text</span>
            <textarea
              type="text"
              value={currText}
              onChange={handleTextChange}
              ref={textareaRef}
              className="nodrag"
            />
          </label>
        </div>
      )}
      {typeOfNode === "newLlm" && (
        <Handle
          className={styles["source-handle"]}
          type="source"
          position={Position.Right}
          id={`${id}-response`}
        />
      )}
      {typeOfNode === "newText" && (
        <Handle
          className={styles["source-handle"]}
          type="source"
          position={Position.Right}
          id={`${id}-output`}
        />
      )}
    </div>
  );
};

export default BlueprintNode;
