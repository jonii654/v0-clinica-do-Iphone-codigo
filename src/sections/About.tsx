import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Neon Marquee Component
function NeonMarquee({ text, reverse = false }: { text: string; reverse?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const content = containerRef.current.querySelector('.neon-marquee-content');
    if (!content) return;

    // Clone for seamless loop
    const clone = content.cloneNode(true);
    containerRef.current.appendChild(clone);

    gsap.to(containerRef.current.children, {
      x: reverse ? '0%' : '-50%',
      duration: 25,
      ease: 'none',
      repeat: -1,
    });
  }, [reverse]);

  return (
    <div className="overflow-hidden whitespace-nowrap py-4 bg-black">
      <div ref={containerRef} className="inline-flex">
        <div className="neon-marquee-content flex items-center">
          {Array(6)
            .fill(text)
            .map((t, i) => (
              <span
                key={i}
                className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mx-8 text-neon-blue"
              >
                {t}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}

export function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Parallax effect for image
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    // Fade in content
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // Stagger text elements
    if (textRef.current) {
      const elements = textRef.current.querySelectorAll('.animate-item');
      gsap.fromTo(
        elements,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }
  }, []);

  return (
    <section id="sobre" ref={sectionRef} className="relative bg-white">
      {/* Top Neon Marquee */}
      <NeonMarquee text="ESPECIALISTAS APPLE • CONFIANÇA E TRANSPARÊNCIA • " />

      {/* Main Content */}
      <div ref={contentRef} className="section-padding" style={{ opacity: 0 }}>
        <div className="w-full px-6 md:px-12 lg:px-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Image */}
              <div ref={imageRef} className="relative">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=1000&fit=crop"
                    alt="Tiago Carneiro - Fundador"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand-blue/10 rounded-full blur-2xl" />
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-brand-blue/10 rounded-full blur-xl" />
              </div>

              {/* Text Content */}
              <div ref={textRef} className="lg:pl-8">
                <span className="animate-item inline-block text-sm font-medium text-brand-blue tracking-wider uppercase mb-4">
                  Quem Somos
                </span>

                <h2 className="animate-item heading-lg text-gray-900 mb-6">
                  Excelência em
                  <br />
                  <span className="text-brand-blue font-normal">
                    Assistência Técnica
                  </span>
                </h2>

                <div className="space-y-4 text-gray-600">
                  <p className="animate-item body-md">
                    Fundada por <strong className="text-gray-900">Tiago Carneiro</strong>,
                    a Clínica do iPhone nasceu da visão de trazer um padrão de
                    excelência premium para Abreu e Lima e região.
                  </p>

                  <p className="animate-item body-md">
                    Com anos de experiência e constante atualização nas tecnologias
                    Apple, nossa equipe é capacitada para diagnosticar e resolver
                    qualquer problema no seu iPhone com rapidez e precisão.
                  </p>

                  <p className="animate-item body-md">
                    Acreditamos que cada cliente merece atendimento personalizado e
                    soluções que realmente funcionam. Por isso, trabalhamos apenas
                    com peças de qualidade e oferecemos garantia em todos os
                    serviços.
                  </p>
                </div>

                <div className="animate-item mt-8 flex items-center gap-8">
                  <div>
                    <span className="block text-4xl font-extralight text-brand-blue">
                      +5
                    </span>
                    <span className="text-sm text-gray-500">Anos de experiência</span>
                  </div>
                  <div className="w-px h-12 bg-gray-200" />
                  <div>
                    <span className="block text-4xl font-extralight text-brand-blue">
                      +10k
                    </span>
                    <span className="text-sm text-gray-500">Clientes atendidos</span>
                  </div>
                  <div className="w-px h-12 bg-gray-200" />
                  <div>
                    <span className="block text-4xl font-extralight text-brand-blue">
                      99%
                    </span>
                    <span className="text-sm text-gray-500">Satisfação</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Neon Marquee */}
      <NeonMarquee
        text="QUALIDADE PREMIUM • TECNOLOGIA DE PONTA • ATENDIMENTO EXCLUSIVO • "
        reverse
      />
    </section>
  );
}
