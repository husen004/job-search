import React, { useState, useEffect } from 'react';

const ScrollUp: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0 });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded shadow-lg hover:bg-blue-700 transition"
      aria-label="Scroll to top"
    >
      ↑ Наверх
    </button>
  );
};

export default ScrollUp;