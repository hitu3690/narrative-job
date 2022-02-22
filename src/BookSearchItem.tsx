import React from 'react'
import { BookDescription } from './BookDescription'

type BookSearchItemProps = {
  description: BookDescription
  onBookAdd: (book: BookDescription) => void
}
/* BookItemコンポーネントの定義 */
const BookSearchItem = (props: BookSearchItemProps) => {
  // データ群セット
  const { title, authors, thumbnail } = props.description
  const handleAddBookClick = () => {
    props.onBookAdd(props.description)
  }
  // DOM記述
  return (
    <div className="book-search-item">
      <h2 title={title}>{title}</h2>
      <div className="authors" title={authors}>
        {authors}
      </div>
      {thumbnail ? <img src={thumbnail} alt="" /> : null}
      <div className="add-book" onClick={handleAddBookClick}>
        <span>+</span>
      </div>
    </div>
  )
}

export default BookSearchItem
