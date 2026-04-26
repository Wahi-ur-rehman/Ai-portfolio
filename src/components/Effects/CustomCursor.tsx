import React, { useEffect, useRef, useState } from 'react';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const glow = glowRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      
      // Update dot position immediately via transform
      if (cursor) {
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${isHovering ? 2.5 : 1})`;
      }
      
      // Update glow position immediately
      if (glow) {
        glow.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isPickable = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('.magnetic') ||
        target.closest('.depth-hover') ||
        target.closest('.action-btn');
      
      setIsHovering(!!isPickable);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isHovering]);

  return (
    <>
      <div
        ref={cursorRef}
        className="custom-cursor"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          pointerEvents: 'none',
          zIndex: 99999,
          // We set initial values but handle movement in JS for performance
          transition: 'transform 0.1s cubic-bezier(0.23, 1, 0.32, 1)',
        }}
      />
      <div
        ref={glowRef}
        className="custom-cursor-glow"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          pointerEvents: 'none',
          zIndex: 99998,
          // No transition on glow for maximum performance/response
          willChange: 'transform',
        }}
      />
    </>
  );
};

export default CustomCursor;
