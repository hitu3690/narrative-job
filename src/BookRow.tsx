import React from 'react'
import { BookToRead } from './BookToRead'

type BookRowProps = {
  book: BookToRead
  onMemoChange: (id: number, memo: string) => void
  onDelete: (id: number) => void
}
/* BookRowコンポーネントの定義 */
const BookRow = (props: BookRowProps) => {
  // データ群セット
  const { title, authors, memo } = props.book
  const handleMemoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    props.onMemoChange(props.book.id, e.target.value)
  }
  const handleDeleteClick = () => {
    console.log('delete')
    props.onDelete(props.book.id)
  }
  // DOM記述
  return (
    <div className="book-row">
      <div title={title} className="title">
        {title}
      </div>
      <div title={authors} className="authors">
        {authors}
      </div>
      <input
        type="text"
        className="memo"
        value={memo}
        onChange={handleMemoChange}
      />
      <div onClick={handleDeleteClick} className="delete-row">
        削除
      </div>
    </div>
  )
}

export default BookRow
