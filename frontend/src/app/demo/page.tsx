// "use client" that tells the backend to serve this file to the client
"use client";

// import React and hooks
import React, { useRef, useEffect, useState } from "react";

// demo component for sign language recognition
const Demo: React.FC = () => {
  // refs for video element and container, these are HTMLImageElement (couldnt get HTMLVideoElement working) and HTMLDivElement types
  const videoRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // state for fps and resolution
  const [fps, setFps] = useState(0);
  const [resolution, setResolution] = useState("");

  // effect to update fps and resolution (useEffect is a hook that runs after the first render and after every update)
  useEffect(() => {
    // get video and container elements defined in refs
    const video = videoRef.current;
    const container = containerRef.current;

    // set initial frame count and start time
    let frameCount = 0;
    let startTime = Date.now();

    // function to update fps
    const updateFps = () => {
      // get current time
      const currentTime = Date.now();

      // calculate elapsed time and divide by 1000 to get seconds
      const elapsedTime = (currentTime - startTime) / 1000;

      // calculate current fps by dividing frame count by elapsed time
      const currentFps = Math.round(frameCount / elapsedTime);

      // set fps and reset frame count and start time
      setFps(currentFps);
      frameCount = 0;
      startTime = currentTime;
    };

    // function to update resolution and container size
    const updateResolution = () => {
      // check if video and container exist
      if (video && container) {
        // get natural width and height of video
        const width = video.naturalWidth;
        const height = video.naturalHeight;

        // call setResolution to set resolution state and set container max width and height
        setResolution(`${width}x${height}`);
        container.style.maxWidth = `${width}px`;
        container.style.maxHeight = `${height}px`;
      }
    };

    // set interval to update fps
    const fpsIntervalId = setInterval(updateFps, 1000);

    // add event listener for video load (this is called when the video has loaded and dimensions are known)
    if (video) {
      // what to do when video is loaded
      video.addEventListener("load", () => {
        // increment frame count and call updateResolution
        frameCount++;
        updateResolution();
      });
    }

    // cleanup function to clear interval and remove event listener
    return () => {
      clearInterval(fpsIntervalId);
      if (video) {
        video.removeEventListener("load", updateResolution);
      }
    };
  }, []);

  // render component
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
          Experience real-time sign language recognition using the Intel
          RealSense D435 camera.
        </p>
      </div>
      {/* video stream container */}
      <div className="row justify-content-center">
        <div ref={containerRef} className="col-auto">
          <div className="position-relative">
            <img
              ref={videoRef}
              src="http://localhost:5000/stream"
              alt="Sign Language Recognition"
              className="w-full h-auto rounded-4 shadow-4"
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
