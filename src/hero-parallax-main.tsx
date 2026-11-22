import React from "react";
import { createRoot } from "react-dom/client";
import HeroParallaxDemo from "./components/hero-parallax-demo";
import "./hero-parallax.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <main className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
      <HeroParallaxDemo />
    </main>
  </React.StrictMode>
);
