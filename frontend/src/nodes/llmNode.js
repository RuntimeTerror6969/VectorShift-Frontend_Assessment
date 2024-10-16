import { Handle, Position } from "reactflow";
import styles from "./llmNode.module.css";

export const LLMNode = ({ id, data }) => {
  return (
    <div className={styles["container"]}>
      <Handle
        className={styles["target-handle"]}
        type="target"
        position={Position.Left}
        id={`${id}-system`}
        style={{ top: `${100 / 3}%` }}
      />
      <Handle
        className={styles["target-handle"]}
        type="target"
        position={Position.Left}
        id={`${id}-prompt`}
        style={{ top: `${200 / 3}%` }}
      />
      <div className={styles["heading"]}>
        <span>LLM</span>
      </div>
      <div className={styles["info"]}>
        <span>This is a LLM.</span>
      </div>
      <Handle
        className={styles["source-handle"]}
        type="source"
        position={Position.Right}
        id={`${id}-response`}
      />
    </div>
  );
};
