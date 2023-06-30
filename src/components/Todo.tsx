// ReactライブラリからFormEventをインポートします。
import { FormEvent } from 'react'
// @tanstack/react-queryからuseQueryClientをインポートします。
import { useQueryClient } from '@tanstack/react-query'
// @heroicons/react/24/solidからArrowRightOnRectangleIconとShieldCheckIconをインポートします。
import {ArrowRightOnRectangleIcon,ShieldCheckIcon,} from '@heroicons/react/24/solid'
// 自作のstoreをインポートします。
import useStore from '../store'
// 自作のカスタムフックuseQueryTasksをインポートします。
import { useQueryTasks } from '../hooks/useQueryTasks'
// 自作のカスタムフックuseMutateTaskをインポートします。
import { useMutateTask } from '../hooks/useMutateTask'
// 自作のカスタムフックuseMutateAuthをインポートします。
import { useMutateAuth } from '../hooks/useMutateAuth'
// TaskItemコンポーネントをインポートします。
import { TaskItem } from './TaskItem'

// Todoというコンポーネントを定義し、エクスポートします。
export const Todo = () => {
  // useQueryClientフックを使ってqueryClientインスタンスを取得します。
  const queryClient = useQueryClient()
  // useStoreフックを使って編集中のタスクを取得します。
  const { editedTask } = useStore()
  // useStoreフックを使って編集中のタスクを更新する関数を取得します。
  const updateTask = useStore((state) => state.updateEditedTask)
  // useQueryTasksフックを使ってタスクのデータとローディング状態を取得します。
  const { data, isLoading } = useQueryTasks()
  // useMutateTaskフックからcreateTaskMutationとupdateTaskMutationを取得します。
  const { createTaskMutation, updateTaskMutation } = useMutateTask()
  // useMutateAuthフックからlogoutMutationを取得します。
  const { logoutMutation } = useMutateAuth()
  // submitTaskHandlerという関数を定義します。この関数はタスクの作成または更新を処理します。
  const submitTaskHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (editedTask.id === 0)
      createTaskMutation.mutate({
        title: editedTask.title,
      })
    else {
      updateTaskMutation.mutate(editedTask)
    }
  }

  // logoutという関数を定義します。この関数はログアウト処理を行います。
  const logout = async () => {
    await logoutMutation.mutateAsync()
    queryClient.removeQueries(['tasks'])
  }

  // TodoリストのUIを返します。
  return (
    <div className="flex justify-center items-center flex-col min-h-screen text-gray-600 font-mono">
      <div className="flex items-center my-3">
        <ShieldCheckIcon className="h-8 w-8 mr-3 text-indigo-500 cursor-pointer" />
        <span className="text-center text-3xl font-extrabold">
          {/* タスク管理のタイトルを表示します。 */}
          Task Manager
        </span>
      </div>
      {/* ログアウト処理を行います。 */}
      <ArrowRightOnRectangleIcon
        onClick={logout}
        className="h-6 w-6 my-6 text-blue-500 cursor-pointer"
      />
      {/* タスクの作成や更新のためのフォームを表示します。 */}
      <form onSubmit={submitTaskHandler}>
        {/* タスクのタイトルを入力するための入力フィールドを表示します。 */}
        <input
          className="mb-3 mr-3 px-3 py-2 border border-gray-300"
          placeholder="title ?"
          type="text"
          onChange={(e) => updateTask({ ...editedTask, title: e.target.value })}
          value={editedTask.title || ''}
        />
        {/* タスクの作成や更新を行うためのボタンを表示します。 */}
        <button
          className="disabled:opacity-40 mx-3 py-2 px-3 text-white bg-indigo-600 rounded"
          disabled={!editedTask.title}
        >
          {editedTask.id === 0 ? 'Create' : 'Update'}
        </button>
      </form>
      {/* ローディング中はLoading...を表示し、ローディングが終了したらタスクのリストを表示します。 */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul className="my-5">
          {/* 各タスク項目を表示します。 */}
          {data?.map((task) => (
            <TaskItem key={task.id} id={task.id} title={task.title} />
          ))}
        </ul>
      )}
    </div>
  )
}
