import React from "react";

import Hero from "../components/Hero";
import LandingLayout from "../components/LandingLayout";

export default function Landing() {
  return (
    <LandingLayout>
      <Hero
        title="Local PDF Tools"
        subtitle="Merge multible PDFs into one. Your files won't leave your System, Local PDF uses your Browser edit PDfs! Your files will not be send to another server!"
        image="/files.jpg"
        ctaText="Merge PDFs"
        ctaLink="/merge"
      />
    </LandingLayout>
  );
}
