/** @jsxImportSource @emotion/react */

import React, { useRef, useState, useEffect } from "react";

import { css } from "@emotion/react";
import * as tf from "@tensorflow/tfjs";

function ObjectDetector({ modelPath }: any) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [model, setModel] = useState(null);

  const detectObjects = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (model && videoRef.current) {
      const video = videoRef.current;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      const [modelWidth, modelHeight] = model.inputs[0].shape.slice(1, 3);

      const input = tf.tidy(() => {
        return tf.image
          .resizeBilinear(tf.browser.fromPixels(video), [
            modelWidth,
            modelHeight,
          ])
          .div(255.0)
          .expandDims(0);
      });

      const prediction = await model.executeAsync(input);
      const [boxes, scores, classes, validDetections] = prediction;

      const boxesData = boxes.dataSync();
      const validDetectionsData = validDetections.dataSync()[0];
      tf.dispose(prediction);

      ctx.drawImage(video, 0, 0, 640, 480);

      for (let i = 0; i < validDetectionsData; ++i) {
        let [x1, y1, x2, y2] = boxesData.slice(i * 4, (i + 1) * 4);
        drawBox(x1 * 640, y1 * 480, x2 * 640, y2 * 480);
      }
    }
  };

  const drawBox = (x1: number, y1: number, x2: number, y2: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.rect(x1, y1, x2 - x1, y2 - y1);
    ctx.stroke();
  };

  useEffect(() => {
    const runDetection = () => {
      detectObjects();
      requestAnimationFrame(runDetection);
    };

    runDetection();
  }, [model]);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadGraphModel(modelPath);
        setModel(loadedModel);
        console.log("Model loaded.");
      } catch (error) {
        console.error("Error loading model", error);
      }
    };

    loadModel();
  }, [modelPath]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <canvas
        css={css({ position: "absolute", top: "0", left: "0", zIndex: "2000" })}
        ref={canvasRef}
        width="640"
        height="480"
      ></canvas>
      <div
        css={css({ position: "absolute", top: "0", left: "0", zIndex: "1000" })}
      >
        <video ref={videoRef} width="640" height="480" autoPlay muted />
      </div>
    </div>
  );
}

export default ObjectDetector;
