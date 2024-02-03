/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from "react";

import { css } from "@emotion/react";
import "./App.css";

import ObjectDetector from "./components/ObjectDetector";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ObjectDetector modelPath="https://raw.githubusercontent.com/da22so/tfjs_models/main/yolov5n_web_model/model.json" />
      </header>
    </div>
  );
}

export default App;
