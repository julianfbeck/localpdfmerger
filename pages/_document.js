import Document, { Html, Head, Main, NextScript } from "next/document";


export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          ></link>
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          ></link>
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          ></link>
          <link rel="manifest" href="/site.webmanifest"></link>
          <link
            rel="mask-icon"
            href="/safari-pinned-tab.svg"
            color="#5bbad5"
          ></link>
          <meta name="msapplication-TileColor" content="#da532c"></meta>
          <meta name="theme-color" content="#ffffff"></meta>

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@Kickbeak" />
          <meta
            name="twitter:title"
            content="PDF Tools, Local PDF Tools - Right in your Browser"
          />
          <meta
            name="twitter:description"
            content="Merge multiple PDFs into one. Your files won't leave your System, Local PDF uses your Browser edit PDfs!"
          />
          <meta property="twitter:creator" content="kickbeak" />
          <meta
            name="twitter:image"
            content="https://github.com/jufabeck2202/localpdfmerger/blob/main/logo.jpeg?raw=true"
          />
          <meta
            property="og:title"
            content="Local PDF Tools - Merge, Optimize, Extract PDFs in your Browser"
          />
          <meta
            property="og:description"
            content="Local PDF uses Webassembly to edit your PDFs inside your Browser. Your files won't leave your System, they will not be sent to another server Currently, we support Merging PDFs, optimizing PDFs, and extracting Information like Images from PDF FilesMerge multiple PDFs into one"
          />
          <meta
            property="og:image"
            content="https://github.com/jufabeck2202/localpdfmerger/blob/main/logo.jpeg?raw=true"
          />
          <meta property="og:url" content="https://localpdf.tech" />
          <meta property="og:site_name" content="LocalPDF" />
          <meta property="og:type" content="website" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
