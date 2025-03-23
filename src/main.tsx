import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/base.css';
import './styles/layout.css';
import './styles/sidebar.css';
import './styles/mobile.css';
import './styles/language.css';
import './styles/components.css';
import './styles/performance.css';

createRoot(document.getElementById("root")!).render(<App />);
