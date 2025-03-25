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

createRoot(document.getElementById("root")!).render(<App />);
