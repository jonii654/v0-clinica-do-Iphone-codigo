import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScreenItem {
  id: string;
  image: string;
  label: string;
  description: string;
}

const screens: ScreenItem[] = [
  {
    id: 'off',
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&h=800&fit=crop',
    label: 'Tela Desligada',
    description: 'Display OLED premium',
  },
  {
    id: 'home',
    image: 'https://images.unsplash.com/photo-1556656793-02715d8dd660?w=600&h=800&fit=crop',
    label: 'Tela Inicial',
    description: 'Interface fluida e responsiva',
  },
  {
    id: 'youtube',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=800&fit=crop',
    label: 'YouTube',
    description: 'Qualidade de vídeo excepcional',
  },
  {
    id: 'instagram',
    image: 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=600&h=800&fit=crop',
    label: 'Instagram',
    description: 'Cores vibrantes e precisas',
  },
];

export function ScreenShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Title animation
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // Grid items stagger animation
    if (gridRef.current) {
      const items = gridRef.current.querySelectorAll('.screen-item');
      gsap.fromTo(
        items,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-apple-gray">
      <div className="w-full px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div ref={titleRef} className="text-center mb-16" style={{ opacity: 0 }}>
            <h2 className="heading-lg text-gray-900 mb-4">
              Qualidade <span className="text-brand-blue font-normal">Visual</span>
            </h2>
            <p className="body-md text-gray-600 max-w-2xl mx-auto">
              Nossas telas oferecem a mesma experiência visual do original,
              com cores vibrantes, alto contraste e touch preciso.
            </p>
          </div>

          {/* Screen Grid */}
          <div
            ref={gridRef}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {screens.map((screen, index) => (
              <div
                key={screen.id}
                className="screen-item group relative"
                style={{ opacity: 0 }}
              >
                <div className="relative aspect-[3/4] rounded-2xl md:rounded-3xl overflow-hidden bg-gray-900 shadow-xl">
                  {/* Image */}
                  <img
                    src={screen.image}
                    alt={screen.label}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-xs md:text-sm font-medium text-brand-blue-light mb-1 block">
                      {screen.description}
                    </span>
                    <h3 className="text-lg md:text-xl font-medium text-white">
                      {screen.label}
                    </h3>
                  </div>

                  {/* Number Badge */}
                  <div className="absolute top-3 left-3 md:top-4 md:left-4 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                    <span className="text-sm md:text-base font-medium text-white">
                      {index + 1}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500 mb-4">
              Todas as telas passam por rigoroso controle de qualidade
            </p>
            <a
              href="https://wa.me/5581999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glass-blue inline-block"
            >
              Solicitar Orçamento
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
