import styles from "./draggableNode.module.css";

export const DraggableNode = ({ type, label, nodeInfo, newNodeType }) => {
  const onDragStart = (event, nodeType) => {
    const appData = { nodeType, nodeInfo, newNodeType };
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify(appData)
    );
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      className={styles.draggableNode}
      onDragStart={(event) => onDragStart(event, type)}
      draggable
    >
      <span>{label}</span>
    </div>
  );
};
