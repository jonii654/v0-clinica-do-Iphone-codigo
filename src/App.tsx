import { useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
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
    <div className="relative min-h-screen bg-background">
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

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/5581999999999"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[90] flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
        style={{
          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
        }}
        aria-label="Falar no WhatsApp"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </a>
    </div>
  );
}

export default App;
