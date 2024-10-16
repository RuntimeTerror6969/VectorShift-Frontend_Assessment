import React, { useState } from "react";
import styles from "./index.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateNodeForm = () => {
  const [formData, setFormData] = useState({
    nodeInfo: "",
    typeOfNode: "",
  });

  const { nodeInfo, typeOfNode } = formData;

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const nodeSavedSuccessfully = () =>
    toast.success(
      "Node saved successfully, click on `Get Your Nodes` to show it",
      {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      }
    );

  const saveNodeToLocalStorage = (event) => {
    event.preventDefault();
    localStorage.setItem("newNodeData", JSON.stringify(formData));
    nodeSavedSuccessfully();
  };

  return (
    <div className={styles["form-container"]}>
      <h3>Add Your New Node</h3>
      <form>
        <div className={styles["form-field"]}>
          <input
            type="text"
            placeholder="Enter node info here"
            name="nodeInfo"
            value={nodeInfo}
            required
            onChange={(event) => handleChange(event)}
            autoComplete="off"
          />
        </div>
        <div className={styles["form-field"]}>
          <select
            name="typeOfNode"
            value={typeOfNode}
            onChange={(event) => handleChange(event)}
          >
            <option value="newLlm">New LLM</option>
            <option value="newText">New Text</option>
          </select>
        </div>
        <button onClick={saveNodeToLocalStorage}>Add Node</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateNodeForm;
