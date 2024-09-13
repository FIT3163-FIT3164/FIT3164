"use client";

import React, { useRef, useEffect, useState } from "react";

const Demo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [fps, setFps] = useState(0);
  const [resolution, setResolution] = useState("");
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to check permissions explicitly
    const requestPermissions = async () => {
      try {
        const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        if (permission.state === 'denied') {
          setError("Camera access is denied. Please allow camera permissions in your browser settings.");
          return;
        }
        // Prompt user for camera access if not granted yet
        if (permission.state !== 'granted') {
          await navigator.mediaDevices.getUserMedia({ video: true });
        }
        getVideoDevices();
      } catch (error) {
        console.error("Error requesting camera permissions:", error);
        setError("Error requesting camera permissions. Please check your browser settings.");
      }
    };

    const getVideoDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((device) => device.kind === "videoinput");
        setDevices(videoDevices);

        // Automatically select the first device if none selected
        if (videoDevices.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error("Error accessing devices:", error);
        setError("Unable to access video devices. Please check your permissions or device connection.");
      }
    };

    requestPermissions();
  }, [selectedDeviceId]);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;

    const requestCameraAccess = async (deviceId?: string) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: deviceId ? { exact: deviceId } : undefined,
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });
        if (video) {
          video.srcObject = stream;
          video.play();
        }
      } catch (error) {
        console.error("Error accessing the camera:", error);
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
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Demo;
