'use client';

import Link from 'next/link';
import { useState } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: 'w-24 h-12',
    md: 'w-32 h-16',
    lg: 'w-40 h-20'
  };

  return (
    <Link 
      href="/" 
      className={`inline-block transition-transform duration-200 hover:scale-105 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg 
        width="450" 
        height="200" 
        viewBox="0 0 450 150" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={`${sizeClasses[size]} transition-all duration-300`}
      >
        {/* Headphones emoji with hover effect */}
        <text 
          x="80" 
          y="110" 
          font-family="Arial" 
          font-size="60" 
          fill="#6E56CF"
          className={`transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}
        >
          🎧
        </text>
        
        {/* Oscillating wave with more pronounced curves */}
        <path 
          d="M110 90 Q130 60 150 90 T190 60 T230 90 T280 60 T340 40 T390  90" 
          stroke="#6E56CF" 
          stroke-width="3" 
          fill="none"
          className="transition-all duration-300"
        />
        
        {/* Red flag at the very end */}
        <path 
          d="M390 90 L407 83 L390 76 Z" 
          fill="#FF4D4D"
          className="transition-all duration-300"
        />
        
        {/* "Voxtrav" text */}
        <text 
          x="270" 
          y="110" 
          text-anchor="middle"
          font-family="Arial" 
          font-size="60" 
          font-weight="bold" 
          fill="#6E56CF" 
          letter-spacing="2"
          className="transition-all duration-300"
        >
          Voxtrav
        </text>
        
        {/* Turquoise circle on the 'o' */}
        <circle 
          cx="210" 
          cy="95" 
          r="12" 
          fill="#4AC3BE"
          className="transition-all duration-300"
        />
        
        {/* Play button on the 'o' */}
        <g 
          transform="translate(210,95) scale(1.2)"
          className={`transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}
        >
          <path d="M-5-7L7 0-5 7Z" fill="#6E56CF"/>
        </g>
      </svg>
    </Link>
  );
} 