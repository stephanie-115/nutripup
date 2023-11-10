import React from "react";
import About from "./HomeComponents/About";
import Features from "./HomeComponents/Features";
import Testimonials from "./HomeComponents/Testimonials";
import FAQ from "./HomeComponents/FAQBody";
import Contact from "./HomeComponents/Contact";

export default function Home() {
  return (
    <>
      <About />
      <Features />
      <Testimonials />
      <FAQ />
      <Contact />
    </>
  );
}

{
  /* <Home>
      
      // Real content

      </Home>
      <TestField>
        <>Testing</>
      </TestField> */
}
