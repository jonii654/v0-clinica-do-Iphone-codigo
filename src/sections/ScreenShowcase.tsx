import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface PhoneMockup {
  id: string;
  image: string;
  label: string;
}

const phones: PhoneMockup[] = [
  { id: 'lock', image: '/images/screen-1.jpg', label: 'Display OLED Premium' },
  { id: 'home', image: '/images/screen-2.jpg', label: 'Interface Fluida' },
  { id: 'social', image: '/images/screen-3.jpg', label: 'Cores Vibrantes' },
  { id: 'video', image: '/images/screen-4.jpg', label: 'Qualidade Excepcional' },
];

function IPhoneFrame({ image, label }: { image: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-3 flex-shrink-0">
      {/* iPhone frame */}
      <div className="relative w-[180px] md:w-[220px] lg:w-[240px]">
        {/* Outer frame */}
        <div
          className="relative rounded-[28px] md:rounded-[32px] lg:rounded-[36px] overflow-hidden shadow-xl"
          style={{
            aspectRatio: '9 / 19.5',
            background: '#1a1a1a',
            padding: '8px',
          }}
        >
          {/* Screen bezel */}
          <div className="relative w-full h-full rounded-[22px] md:rounded-[26px] lg:rounded-[28px] overflow-hidden bg-black">
            {/* Dynamic Island */}
            <div className="absolute top-[6px] left-1/2 -translate-x-1/2 z-20 w-[60px] md:w-[72px] h-[18px] md:h-[22px] bg-black rounded-full" />

            {/* Screen content */}
            <img
              src={image}
              alt={label}
              className="w-full h-full object-cover"
              loading="lazy"
            />

            {/* Bottom home indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 w-[80px] md:w-[100px] h-[3px] md:h-[4px] bg-white/40 rounded-full" />
          </div>
        </div>

        {/* Side button (power) */}
        <div className="absolute right-[-2px] top-[28%] w-[2.5px] h-[28px] bg-[#333] rounded-r-sm" />

        {/* Side buttons (volume) */}
        <div className="absolute left-[-2px] top-[22%] w-[2.5px] h-[16px] bg-[#333] rounded-l-sm" />
        <div className="absolute left-[-2px] top-[30%] w-[2.5px] h-[22px] bg-[#333] rounded-l-sm" />
        <div className="absolute left-[-2px] top-[38%] w-[2.5px] h-[22px] bg-[#333] rounded-l-sm" />
      </div>

      {/* Label */}
      <span className="text-xs md:text-sm font-light text-gray-500">{label}</span>
    </div>
  );
}

export function ScreenShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const phonesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: titleRef.current, start: 'top 85%', toggleActions: 'play none none reverse' },
        }
      );
    }
    if (phonesRef.current) {
      const items = phonesRef.current.querySelectorAll('.phone-item');
      gsap.fromTo(items,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: phonesRef.current, start: 'top 80%', toggleActions: 'play none none reverse' },
        }
      );
    }
  }, []);

  return (
    <section ref={sectionRef} className="section-padding bg-apple-gray">
      <div className="w-full px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div ref={titleRef} className="text-center mb-14" style={{ opacity: 0 }}>
            <h2 className="heading-lg text-gray-900 mb-3">
              Qualidade <span className="text-brand-blue font-normal">Visual</span>
            </h2>
            <p className="body-md text-gray-600 max-w-2xl mx-auto">
              Nossas telas oferecem a mesma experiencia visual do original,
              com cores vibrantes, alto contraste e touch preciso.
            </p>
          </div>

          {/* iPhone mockups row */}
          <div
            ref={phonesRef}
            className="flex items-center justify-center gap-4 md:gap-6 lg:gap-8 overflow-x-auto hide-scrollbar py-4"
          >
            {phones.map((phone) => (
              <div key={phone.id} className="phone-item" style={{ opacity: 0 }}>
                <IPhoneFrame image={phone.image} label={phone.label} />
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
              className="btn-glass-blue-light"
            >
              Solicitar Orcamento
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
