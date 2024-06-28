export default function Home() {
  return (
    <main className="container-xxl">
      <div className="col-md-9 px-3 mx-auto">
        {/* main title and description */}
        <div className="text-center mt-5 mb-5">
          <h1 className="display-4 ls-tight">
            <span className="d-inline-flex bg-clip-text gradient-bottom-right start-purple-500 end-indigo-400 position-relative">
              Realtime
            </span>{" "}
            Sign Language Recognition
          </h1>
          <p className="text-lg font-semibold mt-5 px-lg-5">
            A web-based real-time sign language recognition system using a deep
            learning transformer architecture with depth information from an
            Intel Realsense D435, fine-tuned on the multi-modal How2Sign dataset
            to transcribe American Sign Language (ASL) into English text with an
            accuracy of 82.5%, enhanced with autocorrect and predictive text
            functionalities.
          </p>
        </div>
        {/* feature cards */}
        <div className="row g-4 g-lg-4">
          {/* Eleventy card */}
          <div className="col-12 col-md-6">
            <div className="position-relative rounded-4 shadow-4-hover bg-surface-secondary">
              <div className="p-5 p-md-5 p-xl-5">
                <section>
                  <header>
                    <h1 className="h3 ls-tight mb-4">Eleventy</h1>
                  </header>
                  <p className="text-muted mb-5">
                    A simpler static site generator that transforms a directory
                    of templates into HTML.
                  </p>
                  <footer>
                    <a
                      href="https://www.11ty.dev/docs/"
                      className="font-semibold link-primary stretched-link"
                    >
                      Documentation -&gt;
                    </a>
                  </footer>
                </section>
              </div>
            </div>
          </div>
          {/* Bootstrap 5 card */}
          <div className="col-12 col-md-6">
            <div className="position-relative rounded-4 shadow-4-hover bg-surface-secondary">
              <div className="p-5 p-md-5 p-xl-5">
                <section>
                  <header>
                    <h1 className="h3 ls-tight mb-4">Bootstrap 5</h1>
                  </header>
                  <p className="text-muted mb-5">
                    The worlds most popular framework for building responsive,
                    mobile-first sites.
                  </p>
                  <footer>
                    <a
                      href="https://getbootstrap.com/docs/"
                      className="font-semibold link-primary stretched-link"
                    >
                      Documentation -&gt;
                    </a>
                  </footer>
                </section>
              </div>
            </div>
          </div>
          {/* Webpixels CSS card */}
          <div className="col-12 col-md-6">
            <div className="position-relative rounded-4 shadow-4-hover bg-surface-secondary">
              <div className="p-5 p-md-5 p-xl-5">
                <section>
                  <header>
                    <h1 className="h3 ls-tight mb-4">Webpixels CSS</h1>
                  </header>
                  <p className="text-muted mb-5">
                    Utility and component-centric design system based on
                    Bootstrap 5.
                  </p>
                  <footer>
                    <a
                      href="https://webpixels.io/docs/css/"
                      className="font-semibold link-primary stretched-link"
                    >
                      Documentation -&gt;
                    </a>
                  </footer>
                </section>
              </div>
            </div>
          </div>
          {/* Webpixels Components card */}
          <div className="col-12 col-md-6">
            <div className="position-relative rounded-4 shadow-4-hover bg-surface-secondary">
              <div className="p-5 p-md-5 p-xl-5">
                <section>
                  <header>
                    <h1 className="h3 ls-tight mb-4">Webpixels Components</h1>
                  </header>
                  <p className="text-muted mb-5">
                    Explore over 500 fully responsive and carefully designed
                    Bootstrap components.
                  </p>
                  <footer>
                    <a
                      href="https://webpixels.io/components/"
                      className="font-semibold link-primary stretched-link"
                    >
                      Start Using -&gt;
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
