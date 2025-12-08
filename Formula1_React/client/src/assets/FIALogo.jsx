const FIALogo = ({ className = "w-16 h-auto", color = "currentColor" }) => {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="fiaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#cccccc', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Shield outline */}
      <path
        d="M 60 10 L 100 30 L 100 70 L 60 110 L 20 70 L 20 30 Z"
        stroke="url(#fiaGradient)"
        strokeWidth="3"
        fill="rgba(255, 255, 255, 0.05)"
      />

      {/* F */}
      <path
        d="M 35 35 L 55 35 L 55 42 L 42 42 L 42 48 L 52 48 L 52 54 L 42 54 L 42 70 L 35 70 Z"
        fill="url(#fiaGradient)"
      />

      {/* I */}
      <path
        d="M 60 35 L 67 35 L 67 70 L 60 70 Z"
        fill="url(#fiaGradient)"
      />

      {/* A */}
      <path
        d="M 75 70 L 70 35 L 77 35 L 80 55 L 83 35 L 90 35 L 85 70 L 75 70 Z M 72 52 L 88 52 L 88 58 L 72 58 Z"
        fill="url(#fiaGradient)"
      />

      {/* Bottom text */}
      <text
        x="60"
        y="92"
        fontSize="10"
        fill="url(#fiaGradient)"
        textAnchor="middle"
        fontWeight="bold"
        letterSpacing="2"
      >
        FIA
      </text>
    </svg>
  );
};

export default FIALogo;
