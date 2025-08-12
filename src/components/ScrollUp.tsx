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
      className='.scroll_up'
      aria-label="Scroll to top"
    >
      Up
    </button>
  );
};

export default ScrollUp;