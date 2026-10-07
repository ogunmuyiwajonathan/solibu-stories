import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import ConvexClerkProvider from './lib/ConvexClerkProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConvexClerkProvider>
      {/* `reducedMotion="user"` makes Framer Motion skip transform/layout
          animations for anyone with the OS setting on. It reads the OS
          preference itself, so no app-level state is needed. */}
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          {/* Catches render errors from any route, so one bad component shows a
              recoverable message instead of a blank white screen. */}
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </BrowserRouter>
      </MotionConfig>
    </ConvexClerkProvider>
  </StrictMode>,
)
