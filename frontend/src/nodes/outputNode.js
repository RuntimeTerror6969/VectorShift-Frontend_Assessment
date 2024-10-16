import { useState } from "react";
import { Handle, Position } from "reactflow";
import styles from "./outputNode.module.css";

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(
    data?.outputName || id.replace("customOutput-", "output_")
  );
  const [outputType, setOutputType] = useState(data.outputType || "Text");

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
  };

  const handleTypeChange = (e) => {
    setOutputType(e.target.value);
  };

  return (
    <div className={styles["container"]}>
      <Handle
        className={styles["target-handle"]}
        type="target"
        position={Position.Left}
        id={`${id}-value`}
      />
      <div className={styles["heading"]}>
        <span>Output</span>
      </div>
      <div className={styles["node-body"]}>
        <label className={styles["node-data"]}>
          <span>Name</span>
          <input type="text" value={currName} onChange={handleNameChange} />
        </label>
        <label className={styles["node-data"]}>
          <span>Type</span>
          <select value={outputType} onChange={handleTypeChange}>
            <option value="Text">Text</option>
            <option value="File">Image</option>
          </select>
        </label>
      </div>
    </div>
  );
};
