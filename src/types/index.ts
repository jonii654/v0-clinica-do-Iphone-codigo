// Tipos para Produtos
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  condition: 'new' | 'used' | 'refurbished';
  category: string;
  color?: string;
  inStock: boolean;
}

// Tipos para Serviços
export interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  price?: string;
  duration?: string;
  features?: string[];
}

// Tipos para Carrinho
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

// Tipos para Animações
export interface ScrollAnimationConfig {
  trigger: string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  toggleActions?: string;
}

// Tipos para Seções
export interface SectionProps {
  className?: string;
  id?: string;
}

// Tipos para o Modelo 3D
export interface iPhoneModelProps {
  autoRotate?: boolean;
  rotationSpeed?: number;
  showScreen?: boolean;
}
