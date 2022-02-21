import React, { useState } from 'react'
import './App.css'
import { BookToRead } from './BookToRead'
import BookRow from './BookRow'

const dummyBooks: BookToRead[] = [
  {
    id: 1,
    title: 'はじめてのReact',
    authors: 'ダミー',
    memo: '',
  },
  {
    id: 2,
    title: 'React Hooks入門',
    authors: 'ダミー',
    memo: '',
  },
  {
    id: 3,
    title: '実践Reactアプリケーション開発',
    authors: 'ダミー',
    memo: '',
  },
]

const App = () => {
  /**
   * useState関数の引数は、初期値を設定する
   * dummyBooksを初期状態とする
   */
  const [books, setBooks] = useState(dummyBooks)
  const bookRows = books.map((b) => {
    return (
      <BookRow
        book={b}
        key={b.id}
        onMemoChange={(id: number, memo: string) =>
          handleBookMemoChange(id, memo)
        }
        onDelete={(id: number) => handleBookDelete(id)}
      />
    )
  })
  const handleBookMemoChange = (id: number, memo: string) => {
    /**
     * 送られてきたid以外のbookは更新しない
     * 送られてきたidのbookは、memoのみ書き換えて、新たなbooksを生成
     * 新たなbooksをステートに更新させる
     */
    const newBooks = books.map((b) => {
      return b.id === id ? { ...b, memo: memo } : b
    })
    setBooks(newBooks)
  }
  const handleBookDelete = (id: number) => {
    /**
     * 送られてきたidを除いたbooksを生成
     * 新たなbooksをステートに更新させる
     */
    const newBooks = books.filter((b) => b.id !== id)
    setBooks(newBooks)
  }
  return (
    <div className="App">
      <section className="nav">
        <h1>読みたい本リスト</h1>
        <div className="button-like">本を追加</div>
      </section>
      <section className="main">{bookRows}</section>
    </div>
  )
}

export default App
