"use client";

import React, { useRef, useEffect, useState } from "react";
import axios from "axios";

const Demo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [fps, setFps] = useState(0);
  const [resolution, setResolution] = useState("");
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to request camera access and get the devices
    const getVideoDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((device) => device.kind === "videoinput");
        setDevices(videoDevices);

        if (videoDevices.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(videoDevices[0].deviceId);  // Automatically select the first camera
        }
      } catch (err) {
        console.error("Error accessing video devices:", err);
        setError("Unable to access video devices. Please check your permissions or device connection.");
      }
    };

    getVideoDevices();
  }, [selectedDeviceId]);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;

    const requestCameraAccess = async (deviceId?: string) => {
      try {
        const constraints = {
          video: {
            deviceId: deviceId ? { exact: deviceId } : undefined,
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        };

        // Try accessing the camera stream
        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (video) {
          video.srcObject = stream;
          video.play();
        }
      } catch (err) {
        console.error("Error accessing the camera:", err);

        // Update the error state to display the message
        setError("Failed to access the camera. Please check permissions or device availability.");

        // Retry without specifying a deviceId to get a fallback default camera
        if (deviceId) {
          console.log("Retrying camera access without a specific deviceId...");
          requestCameraAccess();  // Retry without specifying a deviceId
        }
      }
    };

    let frameCount = 0;
    let startTime = Date.now();

    const updateFps = () => {
      const currentTime = Date.now();
      const elapsedTime = (currentTime - startTime) / 1000;
      const currentFps = Math.round(frameCount / elapsedTime);
      setFps(currentFps);
      frameCount = 0;
      startTime = currentTime;
    };

    const updateResolution = () => {
      if (video && container) {
        const width = video.videoWidth;
        const height = video.videoHeight;
        setResolution(`${width}x${height}`);
        container.style.maxWidth = `${width}px`;
        container.style.maxHeight = `${height}px`;
      }
    };

    const countFrames = () => {
      frameCount++;
      requestAnimationFrame(countFrames);
    };

    if (selectedDeviceId) {
      requestCameraAccess(selectedDeviceId);  // Request camera with the selected deviceId
    }

    const fpsIntervalId = setInterval(updateFps, 1000);

    if (video) {
      video.addEventListener("loadeddata", () => {
        updateResolution();
        requestAnimationFrame(countFrames);
      });
    }

    return () => {
      clearInterval(fpsIntervalId);
      if (video) {
        video.removeEventListener("loadeddata", updateResolution);
      }
    };
  }, [selectedDeviceId]);

  useEffect(() => {
    const video = videoRef.current;
  
    const captureFrames = () => {
      const canvas = document.createElement("canvas");
      if (!video) return;
  
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
        canvas.toBlob(async (blob) => {
          if (blob) {
            console.log("Captured frame size:", canvas.width, canvas.height);  // Log the frame size to ensure proper capture
  
            const formData = new FormData();
            formData.append("frame", blob, "frame.png");
  
            try {
              const response = await axios.post("http://localhost:5000/predict", formData, {
                headers: { "Content-Type": "multipart/form-data" },
              });
              console.log("Prediction:", response.data);  // Log the prediction from the server
              setPrediction(response.data.prediction);
            } catch (err) {
              console.error("Error sending frame for prediction:", err);
            }
          }
        }, "image/png");
      }
    };
  
    // Capture frame every 500ms
    const intervalId = setInterval(captureFrames, 500);
    return () => clearInterval(intervalId);
  }, [videoRef]);
  
  

  return (
    <main className="container-xxl">
      {/* title and description */}
      <div className="text-center mt-5 mb-5">
        <h1 className="display-4 ls-tight">
          <span className="d-inline-flex bg-clip-text gradient-bottom-right start-purple-500 end-indigo-400 position-relative">
            Sign Language Recognition Demo
          </span>
        </h1>
        <p className="text-lg font-semibold mt-5 px-lg-5">
          Experience real-time sign language recognition using the Intel RealSense D435 camera.
        </p>
      </div>
      {/* Error message */}
      {error && <div className="alert alert-danger text-center">{error}</div>}
      {/* Camera selection dropdown */}
      <div className="text-center mb-4">
        <label htmlFor="cameraSelect" className="form-label">
          Select Camera:
        </label>
        <select
          id="cameraSelect"
          className="form-select form-select-sm"
          style={{ width: '200px', display: 'inline-block' }}
          onChange={(e) => setSelectedDeviceId(e.target.value)}
          value={selectedDeviceId || ""}
        >
          {devices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${device.deviceId}`}
            </option>
          ))}
        </select>
      </div>
      {/* video stream container */}
      <div className="row justify-content-center">
        <div ref={containerRef} className="col-auto">
          <div className="position-relative">
            <video
              ref={videoRef}
              className="w-full h-auto rounded-4 shadow-4"
              autoPlay
              muted
            />
            {/* fps and resolution overlay */}
            <div className="absolute bottom-0 left-0 m-3 p-2 bg-dark text-white rounded">
              <div>FPS: {fps}</div>
              <div>Resolution: {resolution}</div>
              <div>Prediction: {prediction || "Waiting for hand..."}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Demo;
