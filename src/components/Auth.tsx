// ReactライブラリからuseStateとFormEventをインポートします。
import { useState, FormEvent } from 'react'
// @heroicons/react/24/solidからCheckBadgeIconとArrowPathIconをインポートします。
import { CheckBadgeIcon, ArrowPathIcon } from '@heroicons/react/24/solid'
// 自作のカスタムフックであるuseMutateAuthをインポートします。
import { useMutateAuth } from '../hooks/useMutateAuth'

// Authというコンポーネントを定義し、エクスポートします。
export const Auth = () => {
  // useStateフックを使ってemail, setEmail, pw, setPw, isLogin, setIsLoginのStateとそれを更新する関数を定義します。
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  // useMutateAuthフックからloginMutationとregisterMutationを取り出します。
  const { loginMutation, registerMutation } = useMutateAuth()
  // submitAuthHandlerという関数を定義します。この関数はフォームのsubmitイベントに対応し、認証の処理を行います。
  const submitAuthHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isLogin) {
      // loginMutationのmutateメソッドを呼び出し、emailとpwのStateを引数に渡してログインの処理を行います。
      loginMutation.mutate({
        email: email,
        password: pw,
      })
    } else {
      // registerMutationのmutateAsyncメソッドを呼び出し、emailとpwのStateを引数に渡して登録の処理を行います。
      await registerMutation
        .mutateAsync({
          email: email,
          password: pw,
        })
        .then(() =>
          loginMutation.mutate({
            email: email,
            password: pw,
          })
        )
    }
  }

  // 認証フォームのUIを返します。
  return (
    <>
    {/* 認証フォームの外枠を表すdivタグです。 */}
    <div className="flex justify-center items-center flex-col min-h-screen text-gray-600 font-mono">
      {/* アプリのタイトルを表示する部分です。 */}
      <div className="flex items-center">
      <CheckBadgeIcon className="h-8 w-8 text-blue-500" />
        <span className="text-center text-3xl font-extrabold">
          Todo app by React/Go(Echo)
        </span>
      </div>

      {/* ログインか登録かを示すタイトルを表示する部分です。 */}
      <h2 className="my-6">{isLogin ? 'Login' : 'Create a new account'}</h2>

      {/* 認証フォームの部分です。 */}
      <form onSubmit={submitAuthHandler}>
        {/* メールアドレスを入力するための入力欄の部分です。 */}
        <div>
          <input
            className="mb-3 px-3 text-sm py-2 border border-gray-300"
            name="email"
            type="email"
            autoFocus
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        {/* パスワードを入力するための入力欄の部分です。 */}
        <div>
          <input
            className="mb-3 px-3 text-sm py-2 border border-gray-300"
            name="password"
            type="password"
            placeholder="Password"
            onChange={(e) => setPw(e.target.value)}
            value={pw}
          />
        </div>

        {/* フォームの送信ボタンの部分です。 */}
        <div className="flex justify-center my-2">
          <button
            className="disabled:opacity-40 py-2 px-4 rounded text-white bg-indigo-600"
            disabled={!email || !pw}
            type="submit"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </div>
      </form>

      {/* ログインと登録を切り替えるためのアイコンの部分です。 */}
      <ArrowPathIcon
        onClick={() => setIsLogin(!isLogin)}
        className="h-8 w-8 text-blue-500 cursor-pointer"
      />
    </div>
    </>
  )
}