import { useRef, useEffect } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, MessageCircle } from 'lucide-react';
import gsap from 'gsap';
import { useCartStore } from '@/store/cartStore';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice, getTotalItems, getWhatsAppMessage, clearCart } = useCartStore();
  const drawerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Animate drawer open/close
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Animate backdrop
      gsap.to(backdropRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });

      // Animate drawer
      gsap.to(drawerRef.current, {
        x: 0,
        duration: 0.4,
        ease: 'power2.out',
      });

      // Animate content items
      const items = contentRef.current?.querySelectorAll('.cart-item');
      if (items) {
        gsap.fromTo(
          items,
          { opacity: 0, x: 20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.3,
            stagger: 0.05,
            delay: 0.2,
            ease: 'power2.out',
          }
        );
      }
    } else {
      // Restore body scroll
      document.body.style.overflow = '';

      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
      });

      gsap.to(drawerRef.current, {
        x: '100%',
        duration: 0.3,
        ease: 'power2.in',
      });
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleCheckout = () => {
    const message = getWhatsAppMessage();
    const phone = '5581999999999';
    const url = `https://wa.me/${phone}?text=${message}`;
    window.open(url, '_blank');
  };

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[150] ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        style={{ opacity: 0 }}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[160] shadow-2xl flex flex-col"
        style={{ transform: 'translateX(100%)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-medium text-gray-900">Sua Sacola</h2>
            {totalItems > 0 && (
              <span className="px-2 py-0.5 bg-brand-blue text-white text-xs rounded-full">
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <ShoppingBag className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Seu carrinho está vazio
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Explore nossos produtos e adicione itens à sua sacola
              </p>
              <button
                onClick={closeCart}
                className="btn-glass-blue-light"
              >
                Ver Produtos
              </button>
            </div>
          ) : (
            // Items List
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="cart-item flex gap-4 p-4 bg-gray-50 rounded-2xl"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-white flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.product.description}
                    </p>
                    <p className="text-sm font-medium text-brand-blue mt-1">
                      R$ {item.product.price.toLocaleString('pt-BR')}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="w-7 h-7 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors group"
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart */}
              <button
                onClick={clearCart}
                className="text-sm text-gray-400 hover:text-red-500 transition-colors underline underline-offset-2"
              >
                Limpar carrinho
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-6 bg-white">
            {/* Total */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600">Total estimado</span>
              <span className="text-xl font-medium text-gray-900">
                R$ {totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="btn-glass-green-light w-full justify-center"
            >
              <MessageCircle className="w-4 h-4" />
              Finalizar no WhatsApp
            </button>

            {/* Security Note */}
            <p className="text-xs text-gray-400 text-center mt-3">
              Transação segura e direta com nossos especialistas
            </p>
          </div>
        )}
      </div>
    </>
  );
}
