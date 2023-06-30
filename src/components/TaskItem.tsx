// reactから、FC（FunctionComponentの略でReactの関数コンポーネントを示します）とmemo（パフォーマンス最適化のための高階コンポーネント）をインポートします。
import { FC, memo } from 'react'
// @heroicons/reactのPencilIcon（鉛筆アイコン）とTrashIcon（ゴミ箱アイコン）をインポートします。これらはアイコンの描画に使用します。
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid'
// グローバルステート管理のためのカスタムフックuseStoreをインポートします。
import useStore from '../store'
// タスクに関する型情報をインポートします。ここではTaskという型が定義されています。
import { Task } from '../types'
// タスク操作用のカスタムフックuseMutateTaskをインポートします。
import { useMutateTask } from '../hooks/useMutateTask'

// TaskItemMemoという関数コンポーネントを定義します。propsとしてタスクのidとtitleを受け取ります。
const TaskItemMemo: FC<Omit<Task, 'created_at' | 'updated_at'>> = ({
  id,
  title,
}) => {
  // useStoreフックからタスク編集用の関数を取得します。
  const updateTask = useStore((state) => state.updateEditedTask)
  // useMutateTaskフックからタスク削除用のmutationを取得します。
  const { deleteTaskMutation } = useMutateTask()

  // JSXを返します。タスクのタイトルと、編集・削除アイコンを表示します。
  return (
    <li className="my-3">
      {/* タスクのタイトルを表示します。 */}
      <span className="font-bold">{title}</span>

      <div className="flex float-right ml-20">
        {/* 鉛筆アイコンを表示し、クリックしたときにタスク編集関数を呼び出します。 */}
        <PencilIcon
          className="h-5 w-5 mx-1 text-blue-500 cursor-pointer"
          onClick={() => {
            updateTask({
              id: id,
              title: title,
            })
          }}
        />
        {/* ゴミ箱アイコンを表示し、クリックしたときにタスク削除mutationを実行します。 */}
        <TrashIcon
          className="h-5 w-5 text-blue-500 cursor-pointer"
          onClick={() => {
            deleteTaskMutation.mutate(id)
          }}
        />
      </div>
    </li>
  )
}

// React.memoを用いてTaskItemMemoを最適化し、TaskItemとしてエクスポートします。
// React.memoを使用することで、propsが変更されたときのみ再レンダリングされるようになり、パフォーマンスが向上します。
export const TaskItem = memo(TaskItemMemo)