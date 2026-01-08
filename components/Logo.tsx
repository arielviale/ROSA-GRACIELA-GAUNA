import React from 'react';

export const ThyroidFriendLogo: React.FC<{ className?: string; size?: number; isRunning?: boolean }> = ({
  className = "",
  size = 100,
  isRunning = false
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className}`}
  >
    <style>
      {`
        @keyframes rainbow-glow {
          0%, 100% { filter: drop-shadow(0 0 2px rgba(255,184,77,0.5)); }
          50% { filter: drop-shadow(0 0 8px rgba(255,92,92,0.8)); }
        }
        @keyframes leg-run {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg) translateY(-2px); }
        }
        @keyframes flower-sway {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        .rainbow { animation: rainbow-glow 3s infinite ease-in-out; }
        .leg { animation: ${isRunning ? 'leg-run 0.3s infinite ease-in-out' : 'none'}; transform-origin: top center; }
        .flower { animation: flower-sway 2s infinite ease-in-out; transform-origin: bottom center; }
      `}
    </style>
    <circle cx="50" cy="50" r="47" fill="#FFFBF0" stroke="#1A1A1A" strokeWidth="3" />
    <g className="rainbow">
      <path d="M22 58C22 35 34 22 50 22C66 22 78 35 78 58" stroke="#FF5C5C" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M28 58C28 42 38 30 50 30C62 30 72 42 72 58" stroke="#FFB84D" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M34 58C34 48 41 38 50 38C59 38 66 48 66 58" stroke="#4DB8FF" strokeWidth="5" strokeLinecap="round" fill="none" />
    </g>
    <ellipse cx="50" cy="85" rx="20" ry="3" fill="#E5E5E5" />
    <path className="leg" d="M42 78L38 86" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
    <path className="leg" style={{ animationDelay: '0.15s' }} d="M58 78L62 86" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" />
    <path
      d="M32 75C24 75 18 65 22 48C26 30 44 34 50 44C56 34 74 30 78 48C82 65 76 75 68 75C60 75 56 68 50 68C44 68 40 75 32 75Z"
      fill="#FF7043"
      stroke="#1A1A1A"
      strokeWidth="2.5"
    />
    <circle cx="28" cy="55" r="2" fill="#E64A19" opacity="0.6" />
    <circle cx="34" cy="62" r="1.5" fill="#E64A19" opacity="0.6" />
    <circle cx="66" cy="62" r="2" fill="#E64A19" opacity="0.6" />
    <circle cx="72" cy="55" r="1.5" fill="#E64A19" opacity="0.6" />
    <path d="M42 52C42 52 43 50 45 50C47 50 48 52 48 52" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
    <path d="M52 52C52 52 53 50 55 50C57 50 58 52 58 52" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
    <path d="M45 58C45 58 50 64 55 58" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M46 59C46 59 50 64 54 59" fill="#1A1A1A" />
    <path d="M22 55L16 52" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
    <path d="M78 55L84 52" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
    <g className="flower">
      <path d="M18 85L18 75" stroke="#2D5A27" strokeWidth="2" strokeLinecap="round" />
      <circle cx="18" cy="72" r="5" fill="#4DB8FF" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="18" cy="72" r="1.5" fill="#FFD54F" />
    </g>
    <g className="flower" style={{ animationDelay: '0.5s' }}>
      <path d="M82 85L82 72" stroke="#2D5A27" strokeWidth="2" strokeLinecap="round" />
      <circle cx="82" cy="68" r="6" fill="#FF5C5C" stroke="#1A1A1A" strokeWidth="1.5" />
      <circle cx="82" cy="68" r="2" fill="#FFD54F" />
    </g>
  </svg>
);

export default ThyroidFriendLogo;
