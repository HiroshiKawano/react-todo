// axiosというHTTP通信を行うためのライブラリをインポートします。
import axios from 'axios'
// '@tanstack/react-query'からuseQueryClientとuseMutationという関数をインポートします。
// useQueryClientはReact Queryのクエリのデータを管理するためのフックで、
// useMutationは非同期の変更操作（POST、PUT、DELETEリクエストなど）を行うためのフックです。
import { useQueryClient, useMutation } from '@tanstack/react-query'
// '../types'からTaskという型定義をインポートします。
import { Task } from '../types'
// '../store'からuseStoreというグローバルな状態管理フックをインポートします。
import useStore from '../store'
// '../hooks/useError'からuseErrorというエラーハンドリングのフックをインポートします。
import { useError } from '../hooks/useError'


// useMutateTaskというカスタムフックを宣言します。
export const useMutateTask = () => {
  // QueryClientを初期化します。これにより、サーバーからのデータをキャッシュしたり、
  // そのデータを使ってUIを更新することが可能になります。
  const queryClient = useQueryClient()
  
  // エラーハンドリングのフックからswitchErrorHandling関数を取得します。
  const { switchErrorHandling } = useError()
  
  // 編集中のタスクをリセットするための関数をstoreから取得します。
  const resetEditedTask = useStore((state) => state.resetEditedTask)

  // タスク作成のためのmutationフックを作成します。引数としてtaskを取り、
  // axios.postメソッドを用いて新たなタスクを作成するAPIリクエストを行います。
  // リクエストURLは環境変数から取得したAPIのURLに、'/tasks'を追加して構築します。
  // リクエストボディとしてtaskオブジェクトを渡します。
  const createTaskMutation = useMutation(
    (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) =>
      axios.post<Task>(`${import.meta.env.VITE_APP_API_URL}/tasks`, task),
    {
      // リクエストが成功した場合の処理を定義します。
      onSuccess: (res) => {
        // 現在のタスクのデータをQueryClientから取得します。
        const previousTasks = queryClient.getQueryData<Task[]>(['tasks'])
        if (previousTasks) {
          // 作成した新たなタスクを追加した新たなタスクのリストを作成し、QueryClientにセットします。
          // スプレッド演算子を用いて、既存のタスクリストに新たなタスク（res.data）を追加します。
          queryClient.setQueryData(['tasks'], [...previousTasks, res.data])
        }
        // 編集中のタスクをリセットします。
        resetEditedTask()
      },
      // リクエストが失敗した場合のエラーハンドリングを定義します。
      onError: (err: any) => {
        // エラーからメッセージが取得できる場合は、そのメッセージを用いてエラーハンドリングを行います。
        if (err.response.data.message) {
          switchErrorHandling(err.response.data.message)
        } else {
          // メッセージが取得できない場合は、エラーオブジェクト全体をエラーハンドリングに渡します。
          switchErrorHandling(err.response.data)
        }
      },
    }
  )

  // タスク更新のためのmutationフックを作成します。引数としてtaskを取り、
  // axios.putメソッドを用いて指定したidのタスクを更新するAPIリクエストを行います。
  // リクエストURLは環境変数から取得したAPIのURLに、'/tasks/'とタスクのidを追加して構築します。
  // リクエストボディとしてタスクのtitleを渡します。
  const updateTaskMutation = useMutation(
    (task: Omit<Task, 'created_at' | 'updated_at'>) =>
      axios.put<Task>(`${import.meta.env.VITE_APP_API_URL}/tasks/${task.id}`, {
        title: task.title,
      }),
    {
      // リクエストが成功した場合の処理を定義します。
      onSuccess: (res, variables) => {
        // 現在のタスクのデータをQueryClientから取得します。
        const previousTasks = queryClient.getQueryData<Task[]>(['tasks'])
        if (previousTasks) {
          // 更新したタスクに置き換えた新たなタスクのリストを作成し、QueryClientにセットします。
          // previousTasks.mapメソッドを用いて、更新されたタスク（idがvariables.idと等しいタスク）を
          // 更新後のデータ（res.data）に置き換えます。
          queryClient.setQueryData<Task[]>(
            ['tasks'],
            previousTasks.map((task) =>
              task.id === variables.id ? res.data : task
            )
          )
        }
        // 編集中のタスクをリセットします。
        resetEditedTask()
      },
      // リクエストが失敗した場合のエラーハンドリングを定義します。
      onError: (err: any) => {
        // エラーからメッセージが取得できる場合は、そのメッセージを用いてエラーハンドリングを行います。
        if (err.response.data.message) {
          switchErrorHandling(err.response.data.message)
        } else {
          // メッセージが取得できない場合は、エラーオブジェクト全体をエラーハンドリングに渡します。
          switchErrorHandling(err.response.data)
        }
      },
    }
  )

  // タスク削除のためのmutationフックを作成します。引数としてidを取り、
  // axios.deleteメソッドを用いて指定したidのタスクを削除するAPIリクエストを行います。
  // リクエストURLは環境変数から取得したAPIのURLに、'/tasks/'とタスクのidを追加して構築します。
  const deleteTaskMutation = useMutation(
    (id: number) =>
      axios.delete(`${import.meta.env.VITE_APP_API_URL}/tasks/${id}`),
    {
      // リクエストが成功した場合の処理を定義します。
      onSuccess: (_, variables) => {
        // 現在のタスクのデータをQueryClientから取得します。
        const previousTasks = queryClient.getQueryData<Task[]>(['tasks'])
        if (previousTasks) {
          // 削除したタスクを除いた新たなタスクのリストを作成し、QueryClientにセットします。
          // previousTasks.filterメソッドを用いて、削除されたタスク（idがvariablesと等しいタスク）を
          // フィルタリング（除外）します。
          queryClient.setQueryData<Task[]>(
            ['tasks'],
            previousTasks.filter((task) => task.id !== variables)
          )
        }
        // 編集中のタスクをリセットします。
        resetEditedTask()
      },
      // リクエストが失敗した場合のエラーハンドリングを定義します。
      onError: (err: any) => {
        // エラーからメッセージが取得できる場合は、そのメッセージを用いてエラーハンドリングを行います。
        if (err.response.data.message) {
          switchErrorHandling(err.response.data.message)
        } else {
          // メッセージが取得できない場合は、エラーオブジェクト全体をエラーハンドリングに渡します。
          switchErrorHandling(err.response.data)
        }
      },
    }
  )
  // 作成した各mutationフックをオブジェクトとして返します。
  return {
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
  }
}
