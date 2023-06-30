import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// queryClientの初期設定を追加
// ReactクエリーのQueryClientをnew QueryClientで作成
const queryClient = new QueryClient({})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* そして、アプリケーション全体にReactクエリーを適用するために */}
    {/* AppコンポーネントをQueryClientProviderでラップしていきます。 */}
    {/* この時にクライアントのところに作成したqueryClientを渡しておきます。 */}
    <QueryClientProvider client={queryClient}>
      <App />
      {/* ReactクエリーのDevtoolsを有効化 */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
)
