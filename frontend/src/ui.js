// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback } from "react";
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  ReactFlowProvider,
} from "reactflow";
import { useStore } from "./store";
import { shallow } from "zustand/shallow";
import { InputNode } from "./nodes/inputNode";
import { LLMNode } from "./nodes/llmNode";
import { OutputNode } from "./nodes/outputNode";
import { TextNode } from "./nodes/textNode";

import "reactflow/dist/style.css";
import BlueprintNode from "./nodes/blueprintNode";
import styles from "./ui.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  bluePrint: BlueprintNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore(selector, shallow);

  // this key is used to save and get the flow to and from the localStorage respectively. This flow data which
  // contains the info about all the nodes, edges and viewport as well is then sent to the FastAPI backend
  // server
  const flowKey = "pipeline-flow";

  const getInitNodeData = (nodeID, type) => {
    let nodeData = { id: nodeID, nodeType: `${type}` };
    return nodeData;
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (event?.dataTransfer?.getData("application/reactflow")) {
        const appData = JSON.parse(
          event.dataTransfer.getData("application/reactflow")
        );
        const type = appData?.nodeType;
        const nodeInfo = appData?.nodeInfo;
        const newNodeType = appData?.newNodeType;

        // check if the dropped element is valid
        if (typeof type === "undefined" || !type) {
          return;
        }

        const position = reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const nodeID = getNodeID(type);
        let newNode;

        if (type === "bluePrint") {
          newNode = {
            id: nodeID,
            type,
            position,
            data: { typeOfNode: newNodeType, nodeInfo }, //sending typeOfNode and nodeInfo through data as they are not being accepted as individual props
          };
        } else {
          newNode = {
            id: nodeID,
            type,
            position,
            data: getInitNodeData(nodeID, type),
          };
        }
        console.log("Node details:", newNode);

        addNode(newNode);
      }
    },
    [reactFlowInstance]
  );

  const notifyFlowSavedSuccessfully = () =>
    toast.success("Flow saved successfully", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  // save the current flow - provides info about the nodes, edges and position of all nodes on the canvas
  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flow = reactFlowInstance.toObject();
      console.log("this is the current flow: ", flow);
      localStorage.setItem(flowKey, JSON.stringify(flow));
      notifyFlowSavedSuccessfully();
    }
  }, [reactFlowInstance]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <div className={styles["main-container"]}>
      <div className={styles["save-button-container"]}>
        <button onClick={onSave}>Save Flow</button>
      </div>
      <ReactFlowProvider>
        <div ref={reactFlowWrapper} className={styles["canvas"]}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onInit={setReactFlowInstance}
            nodeTypes={nodeTypes}
            proOptions={proOptions}
            snapGrid={[gridSize, gridSize]}
            connectionLineType="smoothstep"
          >
            <Background color="#aaa" gap={gridSize} />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
      <ToastContainer />
    </div>
  );
};
