import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Ensures smooth, instant viewport reset to top on route change
 * without jerky jumps or stutter.
 */
export function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Scroll window smoothly to top on page switch
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' as ScrollBehavior, // instant prevents weird layout lag while animations run
      });
    } catch {
      window.scrollTo(0, 0);
    }
  }, [pathname, search]);

  return null;
}
