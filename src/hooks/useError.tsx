// 'axios'というライブラリをimportする。axiosはHTTPリクエストを行うためのライブラリ。
import axios from 'axios'
// 'react-router-dom'というライブラリから'useNavigate'をimportする。これはReactのルーティングを管理するためのフック。
import { useNavigate } from 'react-router-dom'
// '../types'というファイルから'CsrfToken'という型をimportする。型は変数や関数が取りうる値や振る舞いを定義するためのもの。
import { CsrfToken } from '../types'
// '../store'というファイルから'useStore'をimportする。useStoreはZustandというステートマネージメントライブラリのフック。
import useStore from '../store'
// useErrorというカスタムフックを定義し、exportする。フックはReactの状態やライフサイクルを関数コンポーネントから扱うためのもの。
export const useError = () => {
  // useNavigateフックを使ってnavigate関数を定義する。この関数はページ遷移を行うためのもの。
  const navigate = useNavigate()
  // useStoreフックを使ってresetEditedTask関数を定義する。この関数は編集中のタスクをリセットするためのもの。
  const resetEditedTask = useStore((state) => state.resetEditedTask)
  // 非同期関数getCsrfTokenを定義する。この関数はサーバーからCSRFトークンを取得するためのもの。
  const getCsrfToken = async () => {
    // axiosを使ってCSRFトークンを取得するGETリクエストを行う。非同期処理なのでawaitを使って結果を待つ。
    const { data } = await axios.get<CsrfToken>(
      // リクエストを行うURLは環境変数から取得する。バックティック(``)と${}を使って文字列内に変数を埋め込む。
      `${import.meta.env.VITE_APP_API_URL}/csrf`
    )
    // 取得したCSRFトークンをaxiosのデフォルトヘッダにセットする。これにより以降のリクエストにこのトークンが自動的に含まれる。
    axios.defaults.headers.common['X-CSRF-TOKEN'] = data.csrf_token
  }

  // switchErrorHandlingという関数を定義する。この関数はエラーメッセージに応じたエラーハンドリングを行う。
  const switchErrorHandling = (msg: string) => {
    // 受け取ったメッセージによって処理を分岐する。
    switch (msg) {
      // メッセージが'invalid csrf token'の場合、以下の処理を行う。
      case 'invalid csrf token':
        // CSRFトークンを再取得する。
        getCsrfToken()
        // ユーザーに対してアラートを表示する。
        alert('CSRF token is invalid, please try again')
        break
      // メッセージが'invalid or expired jwt'の場合、以下の処理を行う。
      case 'invalid or expired jwt':
        // ユーザーに対してアラートを表示する。
        alert('access token expired, please login')
        // 編集中のタスクをリセットする。
        resetEditedTask()
        // ホームページに遷移する。
        navigate('/')
        break
      // メッセージが'missing or malformed jwt'の場合、以下の処理を行う。
      case 'missing or malformed jwt':
        // ユーザーに対してアラートを表示する。
        alert('access token is not valid, please login')
        // 編集中のタスクをリセットする。
        resetEditedTask()
        // ホームページに遷移する。
        navigate('/')
        break
      // メッセージが'duplicated key not allowed'の場合、以下の処理を行う。
      case 'duplicated key not allowed':
        // ユーザーに対してアラートを表示する。
        alert('email already exist, please use another one')
        break
      // メッセージが'crypto/bcrypt: hashedPassword is not the hash of the given password'の場合、以下の処理を行う。
      case 'crypto/bcrypt: hashedPassword is not the hash of the given password':
        // ユーザーに対してアラートを表示する。
        alert('password is not correct')
        break
      // メッセージが'record not found'の場合、以下の処理を行う。
      case 'record not found':
        // ユーザーに対してアラートを表示する。
        alert('email is not correct')
        break
      // どのケースにも該当しないメッセージがきた場合にはそのメッセージをそのままアラートとして表示する。
      default:
        alert(msg)
    }
  }

  // このフックからはswitchErrorHandling関数のみを返す。これにより、このフックを使うコンポーネントはこの関数を使ってエラーハンドリングを行える。
  return { switchErrorHandling }
}
