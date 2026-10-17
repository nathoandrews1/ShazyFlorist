import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { MotionConfig } from 'framer-motion'
import { ContentProvider } from './lib/content'
import { SmoothScroll } from './components/SmoothScroll'
import App from './App'
import './styles/index.css'

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

const splash = (
  <div className="flex min-h-screen items-center justify-center bg-cream">
    <span className="animate-pulse font-serif text-6xl text-rose">✿</span>
  </div>
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <MotionConfig reducedMotion="user">
          <ContentProvider fallback={splash}>
            <SmoothScroll>
              <App />
            </SmoothScroll>
          </ContentProvider>
        </MotionConfig>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
