import { NextSeo } from "next-seo";
import Head from "next/head";
import Hero from "../components/Hero";
import LandingLayout from "../components/LandingLayout";

export default function Home() {
  return (
    <>
      <NextSeo
        title="Local PDF - Your Free PDF Editor in the Browser"
        description="Edit PDF files in your browser with Local PDF. Merge, optimize, watermark, and more. No installation or registration needed, and your files never leave your system."
        canonical="https://localpdf.tech/"
        openGraph={{
          url: "https://localpdf.tech/",
          title: "Local PDF - Your Free PDF Editor in the Browser",
          description:
            "Edit PDF files in your browser with Local PDF. Merge, optimize, watermark, and more. No installation or registration needed, and your files never leave your system.",
          type: "website",
          images: [
            {
              url: "https://raw.githubusercontent.com/julianfbeck/localpdfmerger/main/public/og-image-01.png",
              width: 1200,
              height: 630,
              alt: "Local PDF - Your Free PDF Editor in the Browser",
              type: "image/jpeg",
            },
          ],
          siteName: "Local PDF",
        }}
        twitter={{
          handle: "@julianfbeck",
          site: "@julianfbeck",
          cardType: "summary_large_image",
        }}
      />

      <LandingLayout>
        <Hero
          title="Local PDF Tools"
          subtitle="Local PDF is a powerful PDF editing tool that uses WebAssembly technology to enable seamless editing directly in your web browser. With our platform, you can merge PDFs, optimize PDFs, and extract valuable information, such as images, from PDF files. Best of all, your files remain secure and confidential as they will not leave your system or be sent to another server. Trust Local PDF to be your go-to solution for all your PDF editing needs."
          subtitle2="Get started now by merging, optimizing, or extracting PDFs in your browser."
          image="/files.svg"
          ctaText1="Start Merging PDFs"
          ctaLink1="/merge"
          ctaText2="Start Optimizing PDFs"
          ctaLink2="/optimize"
          ctaText3="Start Extracting Images, Text..."
          ctaLink3="/extract"
          ctaText4="Add Watermark"
          ctaLink4="/watermark"
        />
      </LandingLayout>
    </>
  );
}
