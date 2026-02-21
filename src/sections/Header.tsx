import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { label: 'Serviços', href: '#servicos' },
    { label: 'Sobre', href: '#sobre' },
    { label: 'Produtos', href: '#produtos' },
    { label: 'Localização', href: '#localizacao' },
    { label: 'Contato', href: '#contato' },
  ];

  const scrollToSection = (href: string) => {
    setIsMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="w-full px-6 md:px-12 lg:px-20">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors"
              aria-label="Abrir menu"
            >
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            </button>

            {/* Desktop Navigation - Left */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.slice(0, 2).map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-sm font-light text-gray-700 hover:text-brand-blue transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Logo - Center */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2"
            >
              <img
                src="/images/logo-clinica.jpg"
                alt="Clinica do iPhone"
                className="h-8 md:h-9 w-8 md:w-9 rounded-full object-cover"
              />
              <span className="hidden sm:inline text-sm font-light tracking-wide text-gray-800">
                Clinica do <span className="text-brand-blue font-normal">iPhone</span>
              </span>
            </a>

            {/* Desktop Navigation - Right */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.slice(2).map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-sm font-light text-gray-700 hover:text-brand-blue transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative p-2 -mr-2 md:mr-0 rounded-full hover:bg-black/5 transition-colors"
              aria-label="Abrir carrinho"
            >
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-blue text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[100] transition-all duration-500 ${
          isMenuOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute inset-y-0 left-0 w-full bg-white transition-transform duration-500 ease-out ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full px-8 py-6">
            {/* Close Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 -mr-2 rounded-full hover:bg-black/5 transition-colors"
                aria-label="Fechar menu"
              >
                <X className="w-6 h-6" strokeWidth={1.5} />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 flex flex-col justify-center gap-8">
              {navLinks.map((link, index) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-4xl font-extralight text-gray-900 hover:text-brand-blue transition-colors text-left"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Footer Info */}
            <div className="pt-8 border-t border-gray-100">
              <p className="text-sm font-light text-gray-500">
                Abreu e Lima, PE
              </p>
              <p className="text-sm font-light text-gray-500 mt-1">
                Atendimento de segunda a sábado
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
