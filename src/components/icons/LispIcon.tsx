const LispIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="13" fill="#3FB68B"/>
    <text x="16" y="21" textAnchor="middle" fontFamily="monospace" fontWeight="bold" fontSize="14" fill="white">(λ)</text>
  </svg>
);
export default LispIcon;
