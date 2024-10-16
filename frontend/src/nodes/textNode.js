import { useEffect, useRef, useState } from "react";
import { Handle, Position } from "reactflow";
import styles from "./textNode.module.css";

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || "{{input}}");
  const [dynamicTargetHandleCount, setDynamicTargetHandleCount] = useState(0);
  const textareaRef = useRef();
  const pattern = /\{\{\w+\}\}/g;

  const addDynamicNode = (textareaValue) => {
    const matches = textareaValue.match(pattern);
    if (matches !== null) {
      setDynamicTargetHandleCount(matches.length);
    } else if (matches === null) {
      setDynamicTargetHandleCount(0);
    }
  };

  const handleTextChange = (e) => {
    const textareaElement = e.target;
    const currentText = e.target.value;
    setCurrText(currentText);
    addDynamicNode(currentText);
    textareaElement.style.height = "auto";
    textareaElement.style.height = textareaElement.scrollHeight + "px";
  };

  useEffect(() => {
    const textareaElement = textareaRef.current;
    textareaElement.setAttribute(
      "style",
      "height:" + textareaElement.scrollHeight + "px;overflow-y:hidden;"
    );
  }, []);

  useEffect(() => {
    addDynamicNode(currText);
  }, []);

  return (
    <div className={styles["container"]}>
      {Array.from({ length: dynamicTargetHandleCount }).map((_, index) => (
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
        <span>Text</span>
      </div>
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
      <Handle
        className={styles["source-handle"]}
        type="source"
        position={Position.Right}
        id={`${id}-output`}
      />
    </div>
  );
};
