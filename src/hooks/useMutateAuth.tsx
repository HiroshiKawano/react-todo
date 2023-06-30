// HTTP通信のためのライブラリであるaxiosをインポートします。
import axios from 'axios'
// ルーティングライブラリであるreact-router-domからuseNavigateフックをインポートします。
import { useNavigate } from 'react-router-dom'
// データ取得ライブラリである@tanstack/react-queryからuseMutationフックをインポートします。
import { useMutation } from '@tanstack/react-query'
// 状態管理ライブラリであるZustandのカスタムフックであるuseStoreをインポートします。
import useStore from '../store'
// 自作のtypesファイルからCredential型をインポートします。
import { Credential } from '../types'
// エラーハンドリング用のカスタムフックであるuseErrorをインポートします。
import { useError } from '../hooks/useError'

// useMutateAuthというカスタムフックを定義し、エクスポートします。
export const useMutateAuth = () => {
  // useNavigateフックを使用して、navigate関数を取得します。
  const navigate = useNavigate()
  // useStoreフックを使用して、resetEditedTask関数を取得します。
  const resetEditedTask = useStore((state) => state.resetEditedTask)
  // useErrorフックを使用して、switchErrorHandling関数を取得します。
  const { switchErrorHandling } = useError()
  // useMutationフックを使用して、ログインのmutationを作成します。
  const loginMutation = useMutation(
    async (user: Credential) =>
      // ログインのAPIエンドポイントにPOSTリクエストを送ります。
      await axios.post(`${import.meta.env.VITE_APP_API_URL}/login`, user),
    {
      // リクエスト成功時の処理を定義します。
      onSuccess: () => {
        // 成功したら/todoへリダイレクトします。
        navigate('/todo')
      },
      // リクエスト失敗時のエラーハンドリングを定義します。
      onError: (err: any) => {
        if (err.response.data.message) {
          switchErrorHandling(err.response.data.message)
        } else {
          switchErrorHandling(err.response.data)
        }
      },
    }
  )

  // useMutationフックを使用して、登録のmutationを作成します。
  const registerMutation = useMutation(
    async (user: Credential) =>
      // 登録のAPIエンドポイントにPOSTリクエストを送ります。
      await axios.post(`${import.meta.env.VITE_APP_API_URL}/signup`, user),
    {
      // リクエスト失敗時のエラーハンドリングを定義します。
      onError: (err: any) => {
        if (err.response && err.response.data.message) {
          switchErrorHandling(err.response.data.message)
        } else if (err.response && err.response.data) {
          switchErrorHandling(err.response.data)
        } else {
          // err.responseがundefinedの場合、汎用的なエラーメッセージを表示
          switchErrorHandling('An error occurred while processing your request.')
        }
      },      
    }
  )

  // useMutationフックを使用して、ログアウトのmutationを作成します。
  const logoutMutation = useMutation(
    async () =>
      // ログアウトのAPIエンドポイントにPOSTリクエストを送ります。
      await axios.post(`${import.meta.env.VITE_APP_API_URL}/logout`),
    {
      // リクエスト成功時の処理を定義します。
      onSuccess: () => {
        // 成功したら編集中のタスクをリセットし、ホームへリダイレクトします。
        resetEditedTask()
        navigate('/')
      },
      // リクエスト失敗時のエラーハンドリングを定義します。
      onError: (err: any) => {
        if (err.response.data.message) {
          switchErrorHandling(err.response.data.message)
        } else {
          switchErrorHandling(err.response.data)
        }
      },
    }
  )

  // 作成した3つのmutationを返します。
  return { loginMutation, registerMutation, logoutMutation }
}