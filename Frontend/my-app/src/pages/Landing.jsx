import React from 'react';
import { Navbar } from '../components/layout/Navbar/Navbar';
import { Hero } from '../components/layout/Hero/Hero';
import { Footer } from '../components/layout/Footer/Footer';
import {Features} from '../components/layout/Features/Features';
import {Security} from "../components/layout/Security/Security";

import { Testimonials } from '../components/layout/Testimonials/Testimonials';


export const LandingPage = () => {
  return (
    <div className="app-background">
      <Navbar />
      <Hero />
      <Features /> 
      <Security />
      <Testimonials />
      <Footer />
    </div>
  );
};