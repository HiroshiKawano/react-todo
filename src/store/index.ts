//zustandからcreateをインポート
import { create } from 'zustand'

// zustandからcreateをインポート
// 状態管理したいstateをEditedTaskという名前で定義
type EditedTask = {
  // フィールドとしてidとtitleを設定
  id: number
  title: string
}

// それでは続いてtypeでStateというものを作っていきます。
// 状態管理したいstateを小文字のeditedTaskで定義し、
// そのデータ型を先ほど定義した大文字で始まるEditedTaskに指定
// stateを更新するためのupdateEditedTask関数の型を定義
// 
type State = {
  editedTask: EditedTask
  // EditedTask型のpayloadを引数で受け取れるようにして、返り値はvoidにしています。
  updateEditedTask: (payload: EditedTask) => void
  // stateをリセットするためのresetEditedTaskの型を定義し、引数なしで返り値void型にしておきます。
  resetEditedTask: () => void
}

const useStore = create<State>((set) => ({
  // editedTaskのstateの初期値として、id: 0, title: ''にしておきます。
  editedTask: { id: 0, title: '' },
  // updateEditedTaskは受け取ったpayloadをset関数を使ってeditedTaskのstateに設定
  // そしてresetEditedTaskは、setを使ってeditedTaskのstateを初期化{id: 0, title: ''}
  updateEditedTask: (payload) =>
    set({
      editedTask: payload,
    }),
  resetEditedTask: () => set({ editedTask: { id: 0, title: '' } }),
}))

export default useStore