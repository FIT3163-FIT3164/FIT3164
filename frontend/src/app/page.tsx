"use client"; // Add this line to indicate it's a client component

import { useState } from 'react';
import { FaPlayCircle, FaRegEdit, FaUsers, FaBook, FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function Home() {
  const [isDescriptionVisible, setDescriptionVisible] = useState(false);

  return (
    <main className="container-xxl">
      <div className="col-md-9 px-3 mx-auto">
        {/* Main Title and Description */}
        <div className="text-center mt-5 mb-5">
          <h1 className="display-4 ls-tight mb-4">
            <span className="d-inline-flex bg-clip-text gradient-bottom-right start-blue-500 end-indigo-400 position-relative">
              Realtime
            </span>{" "}
            Sign Language Recognition
          </h1>
          <div className="text-lg font-semibold mt-4 px-lg-5">
            {isDescriptionVisible && (
              <p>
                Experience cutting-edge communication with our web-based real-time Greek Sign Language recognition system. Powered by a deep learning transformer and depth data from the Intel Realsense D435 camera, our solution delivers seamless continuous transcription with over 80% accuracy. Plus, enjoy enhanced interactions with our smart autocorrect and predictive text features designed to make communication smoother and more intuitive.
              </p>
            )}
            <button
              className="btn btn-primary mt-3"
              onClick={() => setDescriptionVisible(!isDescriptionVisible)}
            >
              {isDescriptionVisible ? 'Read Less' : 'Read More'}
              {isDescriptionVisible ? <FaChevronUp className="ms-2" /> : <FaChevronDown className="ms-2" />}
            </button>
          </div>
        </div>
        {/* Feature Cards */}
        <div className="row g-4 g-lg-4">
          {/* American Sign Language Recognition */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card d-flex flex-column h-100 border border-primary shadow-sm">
              <div className="card-body d-flex flex-column">
                <div className="text-center mb-4 flex-grow-1">
                  <FaPlayCircle className="display-1 text-primary mb-3" />
                  <h2 className="h5 text-primary mb-3">American Sign Language Recognition</h2>
                  <p className="text-muted">
                    Try out the real-time isolated American Sign Language Recognition demo using the Intel Realsense D435 or any camera and our deep learning model.
                  </p>
                </div>
                <a
                  href="/demo"
                  className="btn btn-outline-primary mt-auto"
                >
                  Try the Demo &rarr;
                </a>
              </div>
            </div>
          </div>
          {/* Greek Sign Language Recognition */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card d-flex flex-column h-100 border border-success shadow-sm">
              <div className="card-body d-flex flex-column">
                <div className="text-center mb-4 flex-grow-1">
                  <FaRegEdit className="display-1 text-success mb-3" />
                  <h2 className="h5 text-success mb-3">Greek Sign Language Recognition</h2>
                  <p className="text-muted">
                  Try out the real-time continuous Greek Sign Language Recognition demo using the Intel Realsense D435 or any camera and our deep learning model.
                  </p>
                </div>
                <a
                  href="#"
                  className="btn btn-outline-success mt-auto"
                >
                  Try the Demo &rarr;
                </a>
              </div>
            </div>
          </div>
          {/* Team Card */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card d-flex flex-column h-100 border border-warning shadow-sm">
              <div className="card-body d-flex flex-column">
                <div className="text-center mb-4 flex-grow-1">
                  <FaUsers className="display-1 text-warning mb-3" />
                  <h2 className="h5 text-warning mb-3">Our Team</h2>
                  <p className="text-muted">
                    Learn about the team behind this project, including their roles and contributions to making this system a reality.
                  </p>
                </div>
                <a
                  href="/ourteam"
                  className="btn btn-outline-warning mt-auto"
                >
                  Meet the Team &rarr;
                </a>
              </div>
            </div>
          </div>
          {/* Documentation Card */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="card d-flex flex-column h-100 border border-info shadow-sm">
              <div className="card-body d-flex flex-column">
                <div className="text-center mb-4 flex-grow-1">
                  <FaBook className="display-1 text-info mb-3" />
                  <h2 className="h5 text-info mb-3">Documentation</h2>
                  <p className="text-muted">
                    Access the full documentation for the system, including installation guides, API references, and tutorials.
                  </p>
                </div>
                <a
                  href="/doc"
                  className="btn btn-outline-info mt-auto"
                >
                  View Documentation &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}