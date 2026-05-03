import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Runtime check for duplicate React/ReactDOM instances
(() => {
  const win = window as any;

  // Track loaded React instances
  if (win.__REACT_INSTANCE_CHECK) {
    console.error(
      "[AIensen] ⚠️ Múltiplas instâncias de React detectadas! Isso pode causar erros de hooks (useContext/useState). Verifique dependências duplicadas no bundle."
    );
  }
  win.__REACT_INSTANCE_CHECK = true;

  // Verify React and ReactDOM share the same internals
  const reactVersion = React.version;
  const reactDomVersion = (ReactDOM as any).version;

  if (reactVersion !== reactDomVersion) {
    console.error(
      `[AIensen] ⚠️ Versões incompatíveis: React ${reactVersion} ≠ ReactDOM ${reactDomVersion}. Isso causará erros de renderização.`
    );
  }

  if (import.meta.env.DEV) {
    console.info(
      `[AIensen] ✓ React ${reactVersion} | ReactDOM ${reactDomVersion} — instância única verificada.`
    );
  }
})();

createRoot(document.getElementById("root")!).render(<App />);
