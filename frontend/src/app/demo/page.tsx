"use client";

import React, { useRef, useEffect, useState } from "react";
import axios from "axios";

// Define the type for landmarks
interface Landmark {
  x: number;
  y: number;
}

// MediaPipe hand landmark connections
const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],  // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8],  // Index finger
  [5, 9], [9, 10], [10, 11], [11, 12],  // Middle finger
  [9, 13], [13, 14], [14, 15], [15, 16],  // Ring finger
  [13, 17], [17, 18], [18, 19], [19, 20],  // Pinky finger
  [0, 17]  // Palm base
];

const Demo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [fps, setFps] = useState(0);
  const [resolution, setResolution] = useState("");
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [word, setWord] = useState<string>(""); // To hold the word being formed
  const [error, setError] = useState<string | null>(null);
  const [lastPrediction, setLastPrediction] = useState<string | null>(null); // Track last prediction
  const [samePredictionStartTime, setSamePredictionStartTime] = useState<number | null>(null); // Time tracking for the same prediction

  // Handle "Clear" button click
  const handleClear = () => {
    setWord("");
  };

  // Handle "Backspace" button click
  const handleBackspace = () => {
    setWord((prevWord) => prevWord.slice(0, -1)); // Remove the last character from the word
  };

  useEffect(() => {
    const getVideoDevices = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((device) => device.kind === "videoinput");
        setDevices(videoDevices);

        if (videoDevices.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(videoDevices[0].deviceId); // Automatically select the first camera
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
            width: { exact: 640 }, // Fixed width
            height: { exact: 480 }, // Fixed height
          },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (video) {
          video.srcObject = stream;
          video.play();
        }
      } catch (err) {
        console.error("Error accessing the camera:", err);
        setError("Failed to access the camera. Please check permissions or device availability.");
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
      requestCameraAccess(selectedDeviceId);
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
    const canvas = canvasRef.current;
  
    const captureFrames = () => {
      if (!video || !canvas) return;
  
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
        canvas.toBlob(async (blob) => {
          if (blob) {
            console.log("Captured frame size:", canvas.width, canvas.height);
  
            const formData = new FormData();
            formData.append("frame", blob, "frame.png");
  
            try {
              const response = await axios.post("http://localhost:5000/predict", formData, {
                headers: { "Content-Type": "multipart/form-data" },
              });
  
              const { prediction, landmarks, boundingBox } = response.data;
              setPrediction(prediction);
  
              const now = Date.now();
  
              // Only add the same letter if it's predicted for 3 seconds
              if (
                prediction &&
                prediction !== "No hand detected" &&
                prediction === lastPrediction
              ) {
                if (samePredictionStartTime && now - samePredictionStartTime >= 2000) {
                  // Ensure only different letters are concatenated together
                  setWord((prev) => {
                    const lastChar = prev.slice(-1);
                    return lastChar !== prediction ? prev + prediction : prev;
                  });
                  setSamePredictionStartTime(null); // Reset the timer
                }
              } else if (prediction === "No hand detected") {
                setWord((prev) => prev + " "); // Add a space if no hand is detected
              } else {
                setSamePredictionStartTime(Date.now());
              }
  
              setLastPrediction(prediction);
  
              // Draw bounding box and landmarks
              if (context && landmarks && boundingBox) {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
                // Draw bounding box
                context.strokeStyle = "lightgreen";
                context.lineWidth = 3;
                context.strokeRect(
                  boundingBox.x_min,
                  boundingBox.y_min,
                  boundingBox.x_max - boundingBox.x_min,
                  boundingBox.y_max - boundingBox.y_min
                );
  
                // Draw hand landmarks (red dots and connections)
                context.fillStyle = "red";
                const landmarkPoints = landmarks as Landmark[];
  
                // Draw dots
                landmarkPoints.forEach(({ x, y }) => {
                  context.beginPath();
                  context.arc(x, y, 5, 0, 2 * Math.PI);
                  context.fill();
                });
  
                // Draw connections
                context.strokeStyle = "white";
                context.lineWidth = 2;
                HAND_CONNECTIONS.forEach(([startIdx, endIdx]) => {
                  const start = landmarkPoints[startIdx];
                  const end = landmarkPoints[endIdx];
                  if (start && end) {
                    context.beginPath();
                    context.moveTo(start.x, start.y);
                    context.lineTo(end.x, end.y);
                    context.stroke();
                  }
                });
  
                // Draw predicted letter above bounding box
                context.fillStyle = "lightgreen";
                context.font = "40px Arial";
                context.fillText(prediction, boundingBox.x_min, boundingBox.y_min - 10);
              }
            } catch (err) {
              console.error("Error sending frame for prediction:", err);
            }
          }
        }, "image/png");
      }
    };
  
    const intervalId = setInterval(captureFrames, 500);
    return () => clearInterval(intervalId);
  }, [videoRef, lastPrediction, samePredictionStartTime]);

  return (
    <main className="container-xxl">
      {error && <div className="alert alert-danger text-center">{error}</div>}

      <div className="row justify-content-center mt-2">
        <div ref={containerRef} className="col-auto">
          <div className="position-relative">
            <video ref={videoRef} className="w-full h-auto rounded-4 shadow-4" autoPlay muted />
            <canvas ref={canvasRef} className="position-absolute" style={{ top: 0, left: 0 }}></canvas>

            {/* fps and resolution overlay */}
            <div className="absolute bottom-0 left-0 m-3 p-2 bg-dark text-white rounded" style={{ fontSize: '24px' }}>
              <div>Prediction: {prediction || "Loading model....."}</div>
              <div>Word: {word || "..."}</div>
            </div>


            {/* Clear and Backspace Buttons */}
            <div className="text-center mt-3">
              <button className="btn btn-danger me-2" onClick={handleClear}>
                Clear
              </button>
              <button className="btn btn-warning" onClick={handleBackspace}>
                Backspace
              </button>
            </div>

            {/* Camera selection dropdown */}
            <div className="text-center mb-4">
              <label htmlFor="cameraSelect" className="form-label">Select Camera:</label>
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
            {/* Language selection dropdown */}
            <div className="text-center mb-4">
              <label htmlFor="languageSelect" className="form-label">Select Language:</label>
              <select
                id="languageSelect"
                className="form-select form-select-sm"
                style={{ width: '200px', display: 'inline-block' }}
                onChange={(e) => {
                  // Placeholder for language change logic
                  console.log("Selected language:", e.target.value);
                }}
                defaultValue="asl"
              >
                <option value="asl">American Sign Language</option>
                <option value="arbsl">Arabic Sign Language</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Demo;
