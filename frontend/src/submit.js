import styles from "./submit.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const dataSubmittedSuccessfully = () =>
  toast.success("Data Submitted Successfully", {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });

const errorInSubmitForm = () =>
  toast.error("Fetch request failed, check console for error message", {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });

const responseNotOk = () => {
  toast.error(
    "Response from backend is NOT Ok, check console for error message",
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
};

export const SubmitButton = () => {
  const extractAndSubmitData = async (event) => {
    event.preventDefault();
    const flowData = JSON.parse(localStorage.getItem("pipeline-flow"));
    try {
      const endpoint = "http://localhost:8000/pipelines/parse";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(flowData),
      });
      if (response.ok) {
        dataSubmittedSuccessfully();
        const res = await response.json();
        alert(
          `Nodes: ${res.num_nodes}, Edges: ${res.num_edges}, Is DAG: ${res.is_dag}`
        );
      } else {
        console.log("request failed");
        responseNotOk();
      }
    } catch (error) {
      errorInSubmitForm();
      console.log(error);
    }
  };

  return (
    <div className={styles["container"]}>
      <button type="submit" onClick={extractAndSubmitData}>
        Submit
      </button>
      <ToastContainer />
    </div>
  );
};
