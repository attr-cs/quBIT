import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import App from './App.tsx'


export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000*30,   // 30s
      refetchOnWindowFocus: true,
    }
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient} >
    <App />


    {/* Dev tools */}
    {
      import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} />
    )}

    </QueryClientProvider>
  </StrictMode>,
)
