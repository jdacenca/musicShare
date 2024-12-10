import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const useScrollToTop = () => {
  const location = useLocation();
  const scrollableRef = useRef(null);

  useEffect(() => {
    if (scrollableRef.current) {

      const elementPosition = scrollableRef.current.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - 68;

      scrollableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start', inline:'center' });
      scrollableRef.current.scrollTop = offsetPosition;

    }
  }, [location]);

  return scrollableRef;
};

export default useScrollToTop;