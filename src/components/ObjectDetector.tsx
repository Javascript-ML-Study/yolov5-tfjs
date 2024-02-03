import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";

function ObjectDetector({ modelPath }: any) {
  const videoRef = useRef(null);
  const [model, setModel] = useState(null);

  // Load the model
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

  // Setup video stream
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch(console.error);
  }, []);

  // Detect objects in the frame
  const detectObjects = async () => {
    if (model && videoRef.current) {
      const video = videoRef.current;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      // Preprocess the video frame
      const tensor = tf.browser
        .fromPixels(video)
        .resizeNearestNeighbor([640, 640]) // Change this size to the input size of your model
        .expandDims(0)
        .toFloat();
      const prediction = await model.executeAsync(tensor);

      console.log(prediction);

      // Process prediction here
      // The processing will depend on your model's output format

      tensor.dispose(); // Free memory
    }
  };

  // Use requestAnimationFrame for inference
  useEffect(() => {
    const runDetection = () => {
      detectObjects();
      requestAnimationFrame(runDetection);
    };

    runDetection();
  }, [model]);

  return (
    <div>
      <video ref={videoRef} width="640" height="480" autoPlay muted />
    </div>
  );
}

export default ObjectDetector;
