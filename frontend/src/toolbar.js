// toolbar.js

import { DraggableNode } from "./draggableNode";
import { useState } from "react";
import styles from "./toolbar.module.css";

export const PipelineToolbar = () => {
  const [newNodeData, setNewNodeData] = useState([]);

  const getNewNodes = () => {
    const nodeData = JSON.parse(localStorage.getItem("newNodeData"));
    setNewNodeData([...newNodeData, nodeData]);
  };

  return (
    <div className={styles["container"]}>
      <span>
        You can drag these nodes and drop them on the canvas to create a new
        node.
      </span>
      <button onClick={getNewNodes}>Get Your Nodes</button>
      <div className={styles["nodes-container"]}>
        <DraggableNode type="customInput" label="Input" />
        <DraggableNode type="llm" label="LLM" />
        <DraggableNode type="customOutput" label="Output" />
        <DraggableNode type="text" label="Text" />
        {/* <DraggableNode type="bluePrint" label="Blue Print" /> */}
        {newNodeData.map(({ nodeInfo, typeOfNode }, index) => {
          return (
            <DraggableNode
              type="bluePrint"
              label={typeOfNode === "newLlm" ? "New LLM Node" : "New Text Node"}
              nodeInfo={nodeInfo}
              newNodeType={typeOfNode}
            />
          );
        })}
      </div>
    </div>
  );
};
