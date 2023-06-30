import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Auth } from './components/Auth'
import { Todo } from './components/Todo'
import axios from 'axios'
import { CsrfToken } from './types'

// Appコンポーネントはアプリケーションが起動するときに実行され、
// この時にCsrfTokenのエンドポイントにアクセスしてトークンを取得する処理を追加
function App() {
  useEffect(() => {
    // axiosを使った全てのHTTPリクエストが自動的にクッキーや認証関連のヘッダーを含むようになります
    axios.defaults.withCredentials = true
    const getCsrfToken = async () => {
      // 関数の中では、axiosのgetメソッドを使ってCSRFのエンドポイント(/csrf)にアクセスします。
      const { data } = await axios.get<CsrfToken>(
        `${import.meta.env.VITE_APP_API_URL}/csrf`
      )
      //そして取得したCSRFトークをaxiosのdefaultsのheadersを使って'X-CSRF-Token'というヘッダの名前を付けて付与
      axios.defaults.headers.common['X-CSRF-Token'] = data.csrf_token
    }
    getCsrfToken()
  }, [])
  return (
    <BrowserRouter>
      <Routes>
        {/* インデックスのパスにアクセスがあった場合は、Authコンポーネントを表示 */}
        <Route path="/" element={<Auth />} />
        {/* todoのパスにアクセスがあった場合は、/todoコンポーネントを表示 */}
        <Route path="/todo" element={<Todo />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App