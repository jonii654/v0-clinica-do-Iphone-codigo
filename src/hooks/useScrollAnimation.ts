import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationOptions {
  trigger?: string | Element;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  toggleActions?: string;
  onEnter?: () => void;
  onLeave?: () => void;
}

export function useScrollAnimation<T extends HTMLElement>(
  animationCallback: (element: T, gsapInstance: typeof gsap) => gsap.core.Timeline | gsap.core.Tween | void,
  options: ScrollAnimationOptions = {}
) {
  const elementRef = useRef<T>(null);
  const animationRef = useRef<gsap.core.Timeline | gsap.core.Tween | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const {
      trigger = element,
      start = 'top 80%',
      end = 'bottom 20%',
      scrub = false,
      markers = false,
      toggleActions = 'play none none reverse',
      onEnter,
      onLeave,
    } = options;

    // Create animation
    const animation = animationCallback(element, gsap);
    
    if (animation) {
      animationRef.current = animation;

      // Create ScrollTrigger
      ScrollTrigger.create({
        trigger,
        start,
        end,
        scrub,
        markers,
        toggleActions,
        animation,
        onEnter,
        onLeave,
      });
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === trigger) {
          st.kill();
        }
      });
    };
  }, [animationCallback, options]);

  return elementRef;
}

// Hook for fade up animation
export function useFadeUp<T extends HTMLElement>(delay: number = 0) {
  return useScrollAnimation<T>(
    (element, gsapInstance) => {
      gsapInstance.set(element, { opacity: 0, y: 50 });
      return gsapInstance.to(element, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay,
        ease: 'power2.out',
      });
    },
    { start: 'top 85%' }
  );
}

// Hook for stagger children animation
export function useStaggerAnimation<T extends HTMLElement>(
  childSelector: string,
  staggerDelay: number = 0.1
) {
  return useScrollAnimation<T>(
    (element, gsapInstance) => {
      const children = element.querySelectorAll(childSelector);
      gsapInstance.set(children, { opacity: 0, y: 30 });
      return gsapInstance.to(children, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: staggerDelay,
        ease: 'power2.out',
      });
    },
    { start: 'top 80%' }
  );
}

// Hook for parallax effect
export function useParallax<T extends HTMLElement>(speed: number = 0.5) {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const tween = gsap.to(element, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      tween.kill();
    };
  }, [speed]);

  return elementRef;
}
