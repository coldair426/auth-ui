import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  bgOpacity?: number;
  borderOpacity?: number;
}

export function Card({
  bgOpacity = 15,
  borderOpacity = 20,
  children,
  className = '',
  style,
  ...props
}: CardProps) {
  return (
    <div
      className={['rounded-2xl backdrop-blur-md', className].filter(Boolean).join(' ')}
      style={{
        backgroundColor: `rgba(255, 255, 255, ${bgOpacity / 100})`,
        border: `1px solid rgba(255, 255, 255, ${borderOpacity / 100})`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
