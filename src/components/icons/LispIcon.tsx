const LispIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="13" fill="hsl(140 70% 45%)" fillOpacity="0.9"/>
    <circle cx="16" cy="16" r="13" stroke="hsl(140 70% 60%)" strokeWidth="1" strokeOpacity="0.5"/>
    <text x="16" y="21" textAnchor="middle" fontFamily="monospace" fontWeight="bold" fontSize="13" fill="hsl(140 70% 95%)">λ</text>
  </svg>
);
export default LispIcon;
