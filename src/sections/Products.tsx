import { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/types';

gsap.registerPlugin(ScrollTrigger);

const products: Product[] = [
  {
    id: 'iphone-14-pro',
    name: 'iPhone 14 Pro',
    description: '128GB - Roxo Profundo',
    price: 6999,
    originalPrice: 8499,
    image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=600&h=600&fit=crop',
    condition: 'new',
    category: 'iPhone',
    color: '#7B68EE',
    inStock: true,
  },
  {
    id: 'iphone-13',
    name: 'iPhone 13',
    description: '128GB - Meia-Noite',
    price: 4499,
    originalPrice: 5999,
    image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=600&h=600&fit=crop',
    condition: 'refurbished',
    category: 'iPhone',
    color: '#1a1a1a',
    inStock: true,
  },
  {
    id: 'iphone-12',
    name: 'iPhone 12',
    description: '64GB - Azul',
    price: 3299,
    originalPrice: 4999,
    image: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=600&h=600&fit=crop',
    condition: 'used',
    category: 'iPhone',
    color: '#4A90E2',
    inStock: true,
  },
  {
    id: 'capa-silicone',
    name: 'Capa Silicone',
    description: 'Original Apple - Várias Cores',
    price: 299,
    image: 'https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?w=600&h=600&fit=crop',
    condition: 'new',
    category: 'Acessórios',
    color: '#FF6B6B',
    inStock: true,
  },
  {
    id: 'carregador',
    name: 'Carregador 20W',
    description: 'USB-C - Original Apple',
    price: 199,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&h=600&fit=crop',
    condition: 'new',
    category: 'Acessórios',
    color: '#F5F5F7',
    inStock: true,
  },
  {
    id: 'airpods-pro',
    name: 'AirPods Pro 2',
    description: 'Com Cancelamento de Ruído',
    price: 1899,
    originalPrice: 2499,
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&h=600&fit=crop',
    condition: 'new',
    category: 'Áudio',
    color: '#F5F5F7',
    inStock: true,
  },
];

function ProductCard({ product, index }: { product: Product; index: number }) {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: index * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }
  }, [index]);

  const handleAddToCart = () => {
    addItem(product);
    openCart();
  };

  // Generate dynamic background color based on product color
  const bgColor = product.color
    ? `${product.color}20`
    : 'rgba(255,255,255,0.05)';

  const conditionLabel = {
    new: 'Novo',
    used: 'Seminovo',
    refurbished: 'Recondicionado',
  };

  const conditionColor = {
    new: 'bg-green-500/20 text-green-400',
    used: 'bg-yellow-500/20 text-yellow-400',
    refurbished: 'bg-blue-500/20 text-blue-400',
  };

  return (
    <div
      ref={cardRef}
      className="flex-shrink-0 w-[280px] md:w-[320px]"
      style={{ opacity: 0 }}
    >
      <div
        className="relative rounded-3xl overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
        style={{ backgroundColor: bgColor }}
      >
        {/* Condition Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              conditionColor[product.condition]
            }`}
          >
            {conditionLabel[product.condition]}
          </span>
        </div>

        {/* Product Image */}
        <div className="aspect-square p-6 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Product Info */}
        <div className="p-6 pt-0">
          <span className="text-xs text-gray-400 uppercase tracking-wider">
            {product.category}
          </span>
          <h3 className="text-lg font-medium text-white mt-1">{product.name}</h3>
          <p className="text-sm text-gray-400 mt-1">{product.description}</p>

          {/* Price */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xl font-medium text-white">
              R$ {product.price.toLocaleString('pt-BR')}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                R$ {product.originalPrice.toLocaleString('pt-BR')}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="btn-glass-green w-full mt-4 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar à Sacola
          </button>
        </div>
      </div>
    </div>
  );
}

export function Products() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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

  const checkScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', checkScrollButtons, { passive: true });
      checkScrollButtons();
    }
    return () => {
      if (carousel) {
        carousel.removeEventListener('scroll', checkScrollButtons);
      }
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 340;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="produtos"
      ref={sectionRef}
      className="section-padding bg-dark-secondary"
    >
      <div className="w-full">
        {/* Section Header */}
        <div
          ref={titleRef}
          className="px-6 md:px-12 lg:px-20 mb-12"
          style={{ opacity: 0 }}
        >
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h2 className="heading-lg text-white mb-4">
                Produtos <span className="text-brand-blue-light font-normal">Disponíveis</span>
              </h2>
              <p className="body-md text-gray-400 max-w-xl">
                iPhones e acessórios originais com garantia. Qualidade premium
                pelo melhor preço da região.
              </p>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`w-12 h-12 rounded-full border border-white/20 flex items-center justify-center transition-all ${
                  canScrollLeft
                    ? 'hover:bg-white/10 text-white'
                    : 'opacity-30 cursor-not-allowed text-gray-500'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`w-12 h-12 rounded-full border border-white/20 flex items-center justify-center transition-all ${
                  canScrollRight
                    ? 'hover:bg-white/10 text-white'
                    : 'opacity-30 cursor-not-allowed text-gray-500'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Carousel */}
        <div
          ref={carouselRef}
          className="flex gap-6 overflow-x-auto hide-scrollbar px-6 md:px-12 lg:px-20 pb-4"
        >
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="px-6 md:px-12 lg:px-20 mt-12 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Não encontrou o que procura? Entre em contato
          </p>
          <a
            href="https://wa.me/5581999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glass-blue inline-block"
          >
            Consultar Disponibilidade
          </a>
        </div>
      </div>
    </section>
  );
}
