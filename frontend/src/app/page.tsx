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
            <span className="d-inline-flex bg-clip-text gradient-bottom-right start-purple-500 end-indigo-400 position-relative">
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
          {/* Sign Language Recognition Demo Card */}
          <div className="col-12 col-md-6">
            <div className="position-relative rounded-4 shadow-4-hover bg-surface-secondary border border-primary">
              <div className="p-5 p-md-5 p-xl-5 text-center">
                <FaPlayCircle className="display-1 text-primary mb-3" />
                <section>
                  <header>
                    <h2 className="h3 ls-tight mb-4 text-primary">Demo - Sign Language Recognition</h2>
                  </header>
                  <p className="text-muted mb-5">
                    Try out the real-time sign language recognition demo using the Intel Realsense D435 and our deep learning model.
                  </p>
                  <footer>
                    <a
                      href="/demo"
                      className="font-semibold link-primary stretched-link"
                    >
                      Try the Demo &rarr;
                    </a>
                  </footer>
                </section>
              </div>
            </div>
          </div>
          {/* Autocorrect Demo Card */}
          <div className="col-12 col-md-6">
            <div className="position-relative rounded-4 shadow-4-hover bg-surface-secondary border border-success">
              <div className="p-5 p-md-5 p-xl-5 text-center">
                <FaRegEdit className="display-1 text-success mb-3" />
                <section>
                  <header>
                    <h2 className="h3 ls-tight mb-4 text-success">Demo - Autocorrect</h2>
                  </header>
                  <p className="text-muted mb-5">
                    Experience the autocorrect and predictive text functionalities integrated with sign language recognition.
                  </p>
                  <footer>
                    <a
                      href="/demo-autocorrect"
                      className="font-semibold link-success stretched-link"
                    >
                      Try the Demo &rarr;
                    </a>
                  </footer>
                </section>
              </div>
            </div>
          </div>
          {/* Team Card */}
          <div className="col-12 col-md-6">
            <div className="position-relative rounded-4 shadow-4-hover bg-surface-secondary border border-warning">
              <div className="p-5 p-md-5 p-xl-5 text-center">
                <FaUsers className="display-1 text-warning mb-3" />
                <section>
                  <header>
                    <h2 className="h3 ls-tight mb-4 text-warning">Our Team</h2>
                  </header>
                  <p className="text-muted mb-5">
                    Learn about the team behind this project, including their roles and contributions to making this system a reality.
                  </p>
                  <footer>
                    <a
                      href="/team"
                      className="font-semibold link-warning stretched-link"
                    >
                      Meet the Team &rarr;
                    </a>
                  </footer>
                </section>
              </div>
            </div>
          </div>
          {/* Documentation Card */}
          <div className="col-12 col-md-6">
            <div className="position-relative rounded-4 shadow-4-hover bg-surface-secondary border border-info">
              <div className="p-5 p-md-5 p-xl-5 text-center">
                <FaBook className="display-1 text-info mb-3" />
                <section>
                  <header>
                    <h2 className="h3 ls-tight mb-4 text-info">Documentation</h2>
                  </header>
                  <p className="text-muted mb-5">
                    Access the full documentation for the system, including installation guides, API references, and tutorials.
                  </p>
                  <footer>
                    <a
                      href="/documentation"
                      className="font-semibold link-info stretched-link"
                    >
                      View Documentation &rarr;
                    </a>
                  </footer>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
