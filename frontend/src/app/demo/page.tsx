"use client";

import React, { useRef, useEffect, useState } from "react";

const Demo: React.FC = () => {
  const videoRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fps, setFps] = useState(0);
  const [resolution, setResolution] = useState("");

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;

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
        const width = video.naturalWidth;
        const height = video.naturalHeight;
        setResolution(`${width}x${height}`);
        container.style.maxWidth = `${width}px`;
        container.style.maxHeight = `${height}px`;
      }
    };

    const fpsIntervalId = setInterval(updateFps, 1000);

    if (video) {
      video.addEventListener("load", () => {
        frameCount++;
        updateResolution();
      });
    }

    return () => {
      clearInterval(fpsIntervalId);
      if (video) {
        video.removeEventListener("load", updateResolution);
      }
    };
  }, []);

  return (
    <main className="container-xxl">
      <div className="text-center mt-5 mb-5">
        <h1 className="display-4 ls-tight">
          <span className="d-inline-flex bg-clip-text gradient-bottom-right start-purple-500 end-indigo-400 position-relative">
            Sign Language Recognition Demo
          </span>
        </h1>
        <p className="text-lg font-semibold mt-5 px-lg-5">
          Experience real-time sign language recognition using the Intel
          RealSense D435 camera.
        </p>
      </div>
      <div className="row justify-content-center">
        <div ref={containerRef} className="col-auto">
          <div className="position-relative">
            <img
              ref={videoRef}
              src="http://localhost:5000/stream"
              alt="Sign Language Recognition"
              className="w-full h-auto rounded-4 shadow-4"
            />
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
