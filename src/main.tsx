import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PrimeReactProvider } from 'primereact/api'
import { PageTitleProvider } from './shared/providers/PageTitleProvider.tsx'
import { AuthProvider } from './shared/providers/AuthProvider.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppBreadcrumbProvider } from "./shared/providers/AppBreadcrumbProvider.tsx"
import { ToastProvider } from './shared/providers/ToastProvider.tsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <PrimeReactProvider>
      <AuthProvider>
        <ToastProvider>
        <PageTitleProvider>
          <AppBreadcrumbProvider>
            <App />
          </AppBreadcrumbProvider>
        </PageTitleProvider>
        </ToastProvider>
      </AuthProvider>
    </PrimeReactProvider>
  </QueryClientProvider>
)
