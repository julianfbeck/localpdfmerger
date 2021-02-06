import React from "react";

import Hero from "../components/Hero";
import LandingLayout from "../components/LandingLayout";

export default function Landing() {
  return (
    <LandingLayout>
      <Hero
        title="Build this rad landing page from scratch"
        subtitle="This is the subheader section where you describe the basic benefits of your product"
        image="https://source.unsplash.com/collection/404339/800x600"
        ctaText="Create your account now"
        ctaLink="/create"
      />
    </LandingLayout>
  );
}
