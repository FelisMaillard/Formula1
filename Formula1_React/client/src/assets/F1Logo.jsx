const F1Logo = ({ className = "w-20 h-auto", color = "currentColor" }) => {
  return (
    <svg
      viewBox="0 0 200 80"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="f1Gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#e10600', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#ff0800', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* F */}
      <path
        d="M 20 15 L 80 15 L 80 30 L 40 30 L 40 35 L 70 35 L 70 47 L 40 47 L 40 65 L 20 65 Z"
        fill="url(#f1Gradient)"
      />

      {/* 1 */}
      <path
        d="M 100 15 L 120 15 L 120 65 L 100 65 Z M 95 15 L 100 15 L 100 25 L 95 25 Z"
        fill="url(#f1Gradient)"
      />

      {/* Speed lines */}
      <line x1="140" y1="25" x2="195" y2="25" stroke="url(#f1Gradient)" strokeWidth="3" strokeLinecap="round" />
      <line x1="145" y1="40" x2="195" y2="40" stroke="url(#f1Gradient)" strokeWidth="3" strokeLinecap="round" />
      <line x1="150" y1="55" x2="195" y2="55" stroke="url(#f1Gradient)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
};

export default F1Logo;
