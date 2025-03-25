
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/sidebar.css'
import './styles/mobile.css'
import './styles/mobile-layout.css'
import './styles/mobile-modals.css'
import './styles/mobile-navigation.css'
import './styles/mobile-forms.css'
import './styles/mobile-language.css'
import './styles/mobile-order-flow.css'
import './styles/components.css'
import './styles/performance.css'

// Debug log when application initializes
console.log("Application initializing at: ", new Date().toISOString());

// Add event listener for page load completion
window.addEventListener('load', () => {
  console.log("Window fully loaded at: ", new Date().toISOString());
  console.log("Current URL path: ", window.location.pathname);
});

createRoot(document.getElementById("root")!).render(<App />);
