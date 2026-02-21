import { useState, useRef, useEffect } from 'react';
import { Smartphone, Battery, Cpu, ScanFace, Droplets, Shield } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  accentColor: string;
  borderColor: string;
  glowColor: string;
}

const services: Service[] = [
  {
    id: 'telas',
    title: 'Telas de Retina',
    description: 'Substituicao de telas com display OLED original, mantendo a qualidade de imagem e touch perfeito.',
    icon: <Smartphone className="w-6 h-6" />,
    image: '/images/service-telas.jpg',
    accentColor: '#F59E0B',
    borderColor: 'rgba(245, 158, 11, 0.4)',
    glowColor: 'rgba(245, 158, 11, 0.15)',
  },
  {
    id: 'baterias',
    title: 'Baterias Premium',
    description: 'Baterias de alta capacidade com garantia estendida. Recupere a autonomia do seu iPhone.',
    icon: <Battery className="w-6 h-6" />,
    image: '/images/service-baterias.jpg',
    accentColor: '#22C55E',
    borderColor: 'rgba(34, 197, 94, 0.4)',
    glowColor: 'rgba(34, 197, 94, 0.15)',
  },
  {
    id: 'placa',
    title: 'Reparo em Placa',
    description: 'Diagnostico e reparo de problemas na placa logica por tecnicos especializados.',
    icon: <Cpu className="w-6 h-6" />,
    image: '/images/service-placa.jpg',
    accentColor: '#3B82F6',
    borderColor: 'rgba(59, 130, 246, 0.4)',
    glowColor: 'rgba(59, 130, 246, 0.15)',
  },
  {
    id: 'faceid',
    title: 'Face ID',
    description: 'Reparo do sistema de reconhecimento facial com calibracao precisa dos sensores.',
    icon: <ScanFace className="w-6 h-6" />,
    image: '/images/service-faceid.jpg',
    accentColor: '#A855F7',
    borderColor: 'rgba(168, 85, 247, 0.4)',
    glowColor: 'rgba(168, 85, 247, 0.15)',
  },
  {
    id: 'agua',
    title: 'Dano por Agua',
    description: 'Recuperacao de iPhones molhados com limpeza ultrassonica e substituicao de componentes.',
    icon: <Droplets className="w-6 h-6" />,
    image: '/images/service-agua.jpg',
    accentColor: '#06B6D4',
    borderColor: 'rgba(6, 182, 212, 0.4)',
    glowColor: 'rgba(6, 182, 212, 0.15)',
  },
  {
    id: 'garantia',
    title: 'Garantia Estendida',
    description: 'Todos os reparos com garantia de 90 dias. Sua satisfacao e nossa prioridade.',
    icon: <Shield className="w-6 h-6" />,
    image: '/images/service-garantia.jpg',
    accentColor: '#EAB308',
    borderColor: 'rgba(234, 179, 8, 0.4)',
    glowColor: 'rgba(234, 179, 8, 0.15)',
  },
];

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const [isActive, setIsActive] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 0.6, delay: index * 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, [index]);

  useEffect(() => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        opacity: isActive ? 1 : 0,
        y: isActive ? 0 : 10,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [isActive]);

  return (
    <div
      ref={cardRef}
      onClick={() => setIsActive(!isActive)}
      className="relative rounded-3xl overflow-hidden cursor-pointer group"
      style={{
        opacity: 0,
        border: `1.5px solid ${service.borderColor}`,
        boxShadow: `0 0 24px ${service.glowColor}, inset 0 1px 0 rgba(255,255,255,0.05)`,
      }}
    >
      {/* Full-bleed background image */}
      <div className="relative h-72 md:h-80 overflow-hidden">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {/* Dark overlay gradient from bottom */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.1) 100%)`,
          }}
        />
      </div>

      {/* Content overlaid at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
          style={{ backgroundColor: `${service.accentColor}20` }}
        >
          <div style={{ color: service.accentColor }}>{service.icon}</div>
        </div>

        <h3 className="text-xl font-medium text-white mb-1.5">{service.title}</h3>
        <p className="text-sm leading-relaxed text-gray-300/80">{service.description}</p>

        <button
          ref={buttonRef}
          className="btn-glass-blue mt-5 w-full justify-center opacity-0"
          style={{ transform: 'translateY(10px)' }}
          onClick={(e) => {
            e.stopPropagation();
            window.open('https://wa.me/5581999999999', '_blank');
          }}
        >
          {'Agendar Reparo  \u2192'}
        </button>
      </div>
    </div>
  );
}

export function Services() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }
  }, []);

  return (
    <section id="servicos" className="section-padding bg-white">
      <div className="w-full px-6 md:px-12 lg:px-20">
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="heading-lg text-gray-900 mb-4"
            style={{ opacity: 0 }}
          >
            Nossos <span className="text-brand-blue font-normal">Servicos</span>
          </h2>
          <p className="body-md text-gray-600 max-w-2xl mx-auto">
            Oferecemos solucoes completas para o seu iPhone, desde troca de telas
            ate reparos complexos em placa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
