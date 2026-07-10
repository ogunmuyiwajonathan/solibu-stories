import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider, useAuth } from '@clerk/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { convex } from './lib/convex'
import './index.css'
import App from './App.tsx'

function ConvexClerkProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY} afterSignOutUrl="/">
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConvexClerkProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConvexClerkProvider>
  </StrictMode>,
)
