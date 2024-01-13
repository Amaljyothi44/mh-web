import React from "react";
import "../Loading/Loading.css";
import { ClipLoader } from "react-spinners";

const Loading = () => {
  return (
    <div
      style={{
        minHeight: "190px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ClipLoader size={10} color={"#f76fea"} />
    </div>
  );
};

export default Loading;
