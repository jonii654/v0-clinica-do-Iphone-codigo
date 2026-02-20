import { useRef, useEffect } from 'react';
import { MapPin, Clock, Phone, Navigation } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function Location() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current.querySelectorAll('.animate-item'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }
  }, []);

  return (
    <section
      id="localizacao"
      ref={sectionRef}
      className="section-padding bg-white"
    >
      <div className="w-full px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="heading-lg text-gray-900 mb-4">
              Nossa <span className="text-brand-blue font-normal">Localização</span>
            </h2>
            <p className="body-md text-gray-600 max-w-2xl mx-auto">
              Venha nos visitar em Abreu e Lima. Estamos prontos para atender você
              com excelência.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Info Content */}
            <div ref={contentRef}>
              <div className="space-y-8">
                {/* Address */}
                <div className="animate-item flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-brand-blue" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      Endereço
                    </h3>
                    <p className="text-gray-600">
                      Rua das Flores, 123 - Centro
                      <br />
                      Abreu e Lima, PE - CEP: 53520-000
n                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="animate-item flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-brand-blue" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      Horário de Funcionamento
                    </h3>
                    <div className="text-gray-600 space-y-1">
                      <p>Segunda a Sexta: 9h às 18h</p>
                      <p>Sábado: 9h às 13h</p>
                      <p className="text-brand-blue">Domingo: Fechado</p>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="animate-item flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-brand-blue" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      Contato
                    </h3>
                    <p className="text-gray-600">
                      (81) 99999-9999
                      <br />
                      contato@clinicadoiphone.com.br
                    </p>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="animate-item flex flex-col sm:flex-row gap-4 pt-4">
                  <a
                    href="https://wa.me/5581999999999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-glass-green flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Chamar no WhatsApp
                  </a>
                  <a
                    href="https://maps.google.com/?q=Abreu+e+Lima+PE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-glass-blue flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-4 h-4" />
                    Como Chegar
                  </a>
                </div>
              </div>
            </div>

            {/* Store Image */}
            <div ref={imageRef} className="relative" style={{ opacity: 0 }}>
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop"
                  alt="Fachada da Clínica do iPhone"
                  className="w-full h-full object-cover"
                />
                {/* Overlay with brand */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-light text-white">
                    Clínica do <span className="text-brand-blue-light">iPhone</span>
                  </h3>
                  <p className="text-white/80 text-sm mt-1">
                    Sua assistência técnica de confiança
                  </p>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-brand-blue/10 rounded-full blur-2xl" />
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-brand-blue/10 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
