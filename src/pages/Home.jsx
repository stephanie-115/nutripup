import React from "react";
import About from '../components/About';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <>
    <div className="home-container">
      <About />
      <Features />
      <Testimonials />
      <FAQ />
      <Contact />
      </div>
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
