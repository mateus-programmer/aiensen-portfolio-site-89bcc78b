const HTMLIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.665 3.411L6.747 27.036L16 29.836L25.253 27.036L27.335 3.411H4.665Z" fill="hsl(15 90% 55%)" fillOpacity="0.9"/>
    <path d="M16 27.889L23.437 25.822L25.253 5.391H16V27.889Z" fill="hsl(15 90% 60%)" fillOpacity="0.95"/>
    <path d="M16 14.646H12.441L12.16 11.377H16V8.217H8.756L8.838 9.121L9.592 17.806H16V14.646Z" fill="hsl(15 90% 85%)"/>
    <path d="M16 22.758L15.987 22.762L12.982 21.926L12.791 19.79H9.616L9.992 23.988L15.987 25.648L16 25.644V22.758Z" fill="hsl(15 90% 85%)"/>
    <path d="M16 17.806V20.966L19.004 21.802L19.322 18.71H22.508L21.838 25.988L16 27.648V24.488L21.838 22.828L22.058 20.326L16.22 21.966L16 17.806Z" fill="white"/>
    <path d="M16 8.217V11.377H22.916L22.834 12.281L22.058 17.806H16V14.646H19.232L19.46 12.191L16 11.377V8.217Z" fill="white"/>
  </svg>
);
export default HTMLIcon;
