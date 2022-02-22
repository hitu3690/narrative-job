import React, { useState, useEffect, useRef } from 'react'
import { useBookData } from 'useBookData'
import { BookDescription } from './BookDescription'
import BookSearchItem from './BookSearchItem'

type BookSearchDialogProps = {
  maxResults: number
  onBookAdd: (book: BookDescription) => void
}
/* BookDialogコンポーネントの定義 */
const BookSearchDialog = (props: BookSearchDialogProps) => {
  /**
   * refは、「DOM要素への参照を保持する」、「あらゆる書き換え可能な値を保持しておく」のに使える
   * また、その中身が変わってもそのことを通知しないので、コンポーネントの再レンダリングは発生しない
   */
  const titleRef = useRef<HTMLInputElement>(null)
  const authorRef = useRef<HTMLInputElement>(null)
  /* 独自ステート変数を定義して、ステートbookを別ファイルに切り出す */
  const [books, setIsSearching] = useBookData(
    titleRef.current ? titleRef.current!.value : '',
    authorRef.current ? authorRef.current!.value : '',
    props.maxResults,
  )
  const handleSearchClick = () => {
    if (!titleRef.current!.value && !authorRef.current!.value) {
      alert('条件を入力してください')
      return
    }
    /**
     * 検索実行ロジック
     */
    setIsSearching(true)
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
          <input type="text" ref={titleRef} placeholder="タイトルで検索" />
          <input type="text" ref={authorRef} placeholder="著者名で検索" />
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
