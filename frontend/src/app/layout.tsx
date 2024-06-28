import { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

// metadata for the application
export const metadata: Metadata = {
  title: "FIT3164 - Sign Language Recognition",
  description: "FIT3164 - MDS08",
};

// root layout component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* navigation bar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container">
            <a className="navbar-brand" href="#">
              FIT3164 - MDS08
            </a>
            {/* mobile toggle button */}
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            {/* navbar links */}
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                {/* home link */}
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    aria-current="page"
                    href="/"
                    style={{ backgroundColor: "transparent" }}
                  >
                    Home
                  </a>
                </li>
                {/* demo links */}
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="/demo"
                    style={{ backgroundColor: "transparent" }}
                  >
                    Demo - Sign Language Recognition
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#"
                    style={{ backgroundColor: "transparent" }}
                  >
                    Demo - Autocorrect
                  </a>
                </li>
                {/* about dropdown */}
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ backgroundColor: "transparent" }}
                  >
                    About
                  </a>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="navbarDropdown"
                  >
                    <li>
                      <a className="dropdown-item" href="#">
                        Team
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Documentation
                      </a>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        {/* main content */}
        {children}
        {/* bootstrap script */}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
