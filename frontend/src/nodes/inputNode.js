import { useState } from "react";
import { Handle, Position } from "reactflow";
import styles from "./inputNode.module.css";

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(
    data?.inputName || id.replace("customInput-", "input_")
  );
  const [inputType, setInputType] = useState(data.inputType || "Text");

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
  };

  const handleTypeChange = (e) => {
    setInputType(e.target.value);
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["heading"]}>
        <span>Input</span>
      </div>
      <div className={styles["node-body"]}>
        <label className={styles["node-data"]}>
          <span>Name</span>
          <input type="text" value={currName} onChange={handleNameChange} />
        </label>
        <label className={styles["node-data"]}>
          <span>Type</span>
          <select value={inputType} onChange={handleTypeChange}>
            <option value="Text">Text</option>
            <option value="File">File</option>
          </select>
        </label>
      </div>
      <Handle
        className={styles["source-handle"]}
        type="source"
        position={Position.Right}
        id={`${id}-value`}
      />
    </div>
  );
};
