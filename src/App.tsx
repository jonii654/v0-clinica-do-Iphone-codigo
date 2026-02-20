import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { Header } from '@/sections/Header';
import { Hero } from '@/sections/Hero';
import { Services } from '@/sections/Services';
import { About } from '@/sections/About';
import { ScreenShowcase } from '@/sections/ScreenShowcase';
import { Products } from '@/sections/Products';
import { Location } from '@/sections/Location';
import { Footer } from '@/sections/Footer';
import { CartDrawer } from '@/sections/CartDrawer';

gsap.registerPlugin(ScrollTrigger);

function App() {
  // Initialize smooth scroll
  useSmoothScroll();

  useEffect(() => {
    // Refresh ScrollTrigger on load
    ScrollTrigger.refresh();

    // Handle resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main>
        <Hero />
        <Services />
        <About />
        <ScreenShowcase />
        <Products />
        <Location />
      </main>

      {/* Footer */}
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer />
    </div>
  );
}

export default App;
