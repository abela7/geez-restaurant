
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from './components/ThemeProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { DatabaseProvider } from './contexts/DatabaseContext'

// Create a client for React Query
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <DatabaseProvider>
            <App />
          </DatabaseProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
