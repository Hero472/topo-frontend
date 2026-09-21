import React, { useState } from 'react';
import styles from './Tooltip.module.css';

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number; // Optional delay in ms
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top',
  delay = 200 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timer, setTimer] = useState<Timeout | null>(null);

  const handleMouseEnter = () => {
    const newTimer = setTimeout(() => setIsVisible(true), delay);
    setTimer(newTimer);
  };

  const handleMouseLeave = () => {
    if (timer) clearTimeout(timer);
    setIsVisible(false);
  };

  return (
    <div 
      className={styles.wrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      // Accessibility: also trigger on focus for keyboard users
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div className={`${styles.tooltip} ${styles[position]}`} role="tooltip">
          {content}
          {/* The arrow is handled purely in CSS via ::after */}
        </div>
      )}
    </div>
  );
};