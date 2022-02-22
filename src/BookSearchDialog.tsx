import React, { useState } from 'react'
import { BookDescription } from './BookDescription'
import BookSearchItem from './BookSearchItem'

type BookSearchDialogProps = {
  maxResults: number
  onBookAdd: (book: BookDescription) => void
}
/* BookDialogコンポーネントの定義 */
const BookSearchDialog = (props: BookSearchDialogProps) => {
  /**
   * setXXの関数呼び出しを通じてステート変数が変化すると、それを検知してコンポーネントの再レンダリングを行う。（つまり、コンポーネント関数が呼び出される）
   * handleTitleInputChangeの引数に'A'を入力すると、最初のuseState('')->は、useState('A')
   * ちなみに親コンポーネントから渡されるpropsの値が変更された場合も、子コンポーネントは再レンダリングされる
   */
  const [books, setBooks] = useState([] as BookDescription[])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const handleTitleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }
  const handleAuthorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthor(e.target.value)
  }
  const handleSearchClick = () => {
    if (!title && !author) {
      alert('入力してください')
      return
    } else {
    }
  }
  const handleBookAdd = (book: BookDescription) => {
    props.onBookAdd(book)
  }
  const bookItems = books.map((b, idx) => {
    return (
      <BookSearchItem
        description={b}
        onBookAdd={(b) => handleBookAdd(b)}
        key={idx}
      />
    )
  })
  // DOM記述
  return (
    <div className="dialog">
      <div className="operation">
        <div className="conditions">
          <input
            type="text"
            onChange={handleTitleInputChange}
            placeholder="タイトルで検索"
          />
          <input
            type="text"
            onChange={handleAuthorInputChange}
            placeholder="著者名で検索"
          />
        </div>
        <div className="button-like" onClick={handleSearchClick}>
          検索
        </div>
      </div>
      <div className="search-results">{bookItems}</div>
    </div>
  )
}

export default BookSearchDialog
