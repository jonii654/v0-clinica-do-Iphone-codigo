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
  bgColor: 'light' | 'dark';
}

const services: Service[] = [
  {
    id: 'telas',
    title: 'Telas de Retina',
    description: 'Substituição de telas com display OLED original, mantendo a qualidade de imagem e touch perfeito.',
    icon: <Smartphone className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&h=400&fit=crop',
    bgColor: 'dark',
  },
  {
    id: 'baterias',
    title: 'Baterias Premium',
    description: 'Baterias de alta capacidade com garantia estendida. Recupere a autonomia do seu iPhone.',
    icon: <Battery className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=400&fit=crop',
    bgColor: 'light',
  },
  {
    id: 'placa',
    title: 'Reparo em Placa',
    description: 'Diagnóstico e reparo de problemas na placa lógica por técnicos especializados.',
    icon: <Cpu className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop',
    bgColor: 'light',
  },
  {
    id: 'faceid',
    title: 'Face ID',
    description: 'Reparo do sistema de reconhecimento facial com calibração precisa dos sensores.',
    icon: <ScanFace className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1556656793-02715d8dd660?w=600&h=400&fit=crop',
    bgColor: 'dark',
  },
  {
    id: 'agua',
    title: 'Dano por Água',
    description: 'Recuperação de iPhones molhados com limpeza ultrassônica e substituição de componentes.',
    icon: <Droplets className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=600&h=400&fit=crop',
    bgColor: 'dark',
  },
  {
    id: 'garantia',
    title: 'Garantia Estendida',
    description: 'Todos os reparos com garantia de 90 dias. Sua satisfação é nossa prioridade.',
    icon: <Shield className="w-6 h-6" />,
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop',
    bgColor: 'light',
  },
];

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const [isActive, setIsActive] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    setIsActive(!isActive);
  };

  useEffect(() => {
    if (!cardRef.current) return;

    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: index * 0.1,
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
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scale: isActive ? 1.1 : 1,
        duration: 0.5,
        ease: 'power2.out',
      });
    }
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        opacity: isActive ? 1 : 0,
        y: isActive ? 0 : 10,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [isActive]);

  const isDark = service.bgColor === 'dark';

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      className={`relative rounded-3xl overflow-hidden cursor-pointer group ${
        isDark ? 'bg-dark-secondary' : 'bg-apple-gray'
      }`}
      style={{ opacity: 0 }}
    >
      {/* Image */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img
          ref={imageRef}
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-500"
        />
        <div
          className={`absolute inset-0 ${
            isDark
              ? 'bg-gradient-to-t from-dark-secondary via-dark-secondary/50 to-transparent'
              : 'bg-gradient-to-t from-apple-gray via-apple-gray/50 to-transparent'
          }`}
        />
      </div>

      {/* Content */}
      <div className="relative p-6">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
            isDark ? 'bg-white/10' : 'bg-brand-blue/10'
          }`}
        >
          <div className={isDark ? 'text-white' : 'text-brand-blue'}>
            {service.icon}
          </div>
        </div>

        <h3
          className={`text-xl font-medium mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          {service.title}
        </h3>

        <p
          className={`text-sm leading-relaxed ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          {service.description}
        </p>

        {/* Hidden Button */}
        <button
          ref={buttonRef}
          className="btn-glass-blue mt-6 w-full opacity-0"
          style={{ transform: 'translateY(10px)' }}
          onClick={(e) => {
            e.stopPropagation();
            window.open('https://wa.me/5581999999999', '_blank');
          }}
        >
          AGENDAR REPARO →
        </button>
      </div>
    </div>
  );
}

export function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
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
  }, []);

  return (
    <section
      id="servicos"
      ref={sectionRef}
      className="section-padding bg-white"
    >
      <div className="w-full px-6 md:px-12 lg:px-20">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="heading-lg text-gray-900 mb-4"
            style={{ opacity: 0 }}
          >
            Nossos <span className="text-brand-blue font-normal">Serviços</span>
          </h2>
          <p className="body-md text-gray-600 max-w-2xl mx-auto">
            Oferecemos soluções completas para o seu iPhone, desde troca de telas
            até reparos complexos em placa.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
