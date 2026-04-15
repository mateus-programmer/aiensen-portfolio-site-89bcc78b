const JuliaIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10.5" cy="10" r="5" fill="hsl(140 65% 50%)"/>
    <circle cx="21.5" cy="10" r="5" fill="hsl(0 70% 55%)"/>
    <circle cx="16" cy="20" r="5" fill="hsl(270 80% 60%)"/>
  </svg>
);
export default JuliaIcon;
