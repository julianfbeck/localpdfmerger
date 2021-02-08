import React from "react";

import Hero from "../components/Hero";
import LandingLayout from "../components/LandingLayout";

export default function Landing() {
  return (
    <LandingLayout>
      <Hero
        title="Local PDF Tools"
        subtitle="Local PDF uses Webassembly to edit your PDFs inside your Browser. Your files won't leave your System, they will not be send to another server"
        subtitle2="Currently we support merging PDFs. You can combine multiple PDF files into one large File."
        image="/files.svg"
        ctaText="Start Merging PDFs"
        ctaLink="/merge"
      />
    </LandingLayout>
  );
}
