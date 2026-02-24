import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../shared/assets/index.css'
import { Providers } from './providers'
import { AppRouter } from './router'
import { ErrorBoundary } from './ErrorBoundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Providers>
        <AppRouter />
      </Providers>
    </ErrorBoundary>
  </StrictMode>,
)
