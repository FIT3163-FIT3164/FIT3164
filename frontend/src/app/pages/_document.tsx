import Document, { Html, Head, Main, NextScript } from "next/document";

// custom document component
class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* meta tags for character set, viewport, description, and author */}
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <meta name="description" content="" />
          <meta name="author" content="" />

          {/* favicon */}
          <link rel="icon" type="image/x-icon" href="/assets/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
