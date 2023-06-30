// axiosというHTTPクライアントライブラリをインポートします。axiosを利用することで、サーバとのHTTP通信が容易になります。
import axios from 'axios'
// @tanstack/react-queryのuseQueryフックをインポートします。このフックを使うことで、非同期データ取得の状態管理を簡単に行えます。
import { useQuery } from '@tanstack/react-query'
// タスクに関する型情報をインポートします。ここではTaskという型が定義されています。
import { Task } from '../types'
// エラーハンドリング用のフックをインポートします。これによりエラーの処理を効率的に行うことが可能となります。
import { useError } from '../hooks/useError'

// useQueryTasksというカスタムフックを定義します。このフックを使うと、タスクの一覧データを取得するクエリを簡単に行うことができます。
export const useQueryTasks = () => {
  // useErrorフックからエラーハンドリング用の関数を取得します。
  const { switchErrorHandling } = useError()

  // タスクの一覧データを取得する非同期関数を定義します。axiosを用いてサーバからタスクの一覧データを取得します。
  const getTasks = async () => {
    // axios.getを用いてタスクの一覧データを取得します。サーバとの通信時にはクッキー情報を送信します（withCredentials: true）。
    const { data } = await axios.get<Task[]>(
      `${import.meta.env.VITE_APP_API_URL}/tasks`,
      { withCredentials: true }
    )
    // 取得したデータを返します。
    return data
  }

  // useQueryフックを使ってタスクの一覧データを取得するクエリを行います。
  // このクエリの結果や状態は、このフックを使うコンポーネントで簡単に扱うことができます。
  return useQuery<Task[], Error>({
    // このクエリのキーを指定します。このキーを使って、同じクエリの結果や状態を共有することができます。
    queryKey: ['tasks'],
    // このクエリで実行する関数を指定します。ここでは、上で定義したgetTasks関数を指定しています。
    queryFn: getTasks,
    // このクエリの結果の「古さ」を指定します。ここではInfinityを指定することで、結果がいつでも新鮮（再取得不要）であると指定しています。
    staleTime: Infinity,
    // エラーが発生したときのハンドリングを指定します。
    onError: (err: any) => {
      // エラーレスポンスからメッセージが取得できる場合は、そのメッセージを用いてエラーハンドリングを行います。
      if (err.response.data.message) {
        switchErrorHandling(err.response.data.message)
      } else {
        // メッセージが取得できない場合は、エラーオブジェクト全体をエラーハンドリングに渡します。
        switchErrorHandling(err.response.data)
      }
    },
  })
}
