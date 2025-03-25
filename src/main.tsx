
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
console.log("Window location: ", window.location.href);
console.log("Running in iframe: ", window.top !== window.self);

// Attempt to detect if we're in the Lovable editor
const isInLovableEditor = window.top !== window.self;
if (isInLovableEditor) {
  console.log("Running in Lovable editor iframe - applying special handling");
  // Add a class to the body for iframe-specific styling if needed
  document.body.classList.add('in-editor-iframe');
}

// Add event listener for page load completion
window.addEventListener('load', () => {
  console.log("Window fully loaded at: ", new Date().toISOString());
  console.log("Current URL path: ", window.location.pathname);
  console.log("DOM content loaded and rendered");
  
  // Force a repaint after loading is complete
  setTimeout(() => {
    console.log("Triggering repaint");
    document.body.style.display = 'none';
    document.body.offsetHeight; // Force reflow
    document.body.style.display = '';
  }, 100);
});

const root = createRoot(document.getElementById("root")!);
console.log("Root element found, rendering app");
root.render(<App />);
console.log("App render initiated");
