import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import './App.css'
import { BookToRead } from './BookToRead'
import BookRow from './BookRow'
import BookSearchDialog from './BookSearchDialog'
import { BookDescription } from './BookDescription'

/**
 * ダイアログに必要な要素作成とスタイル設定
 */
Modal.setAppElement('#root')
const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    padding: 0,
    transform: 'translate(-50%, -50%)',
  },
}

const APP_KEY = 'hooks-book'

const App = () => {
  /**
   * useState関数の引数は、初期値を設定する
   * dummyBooksを初期状態とする
   * useEffect1 -> 初期リロード時(第二引数が空配列)にローカルストレージのbooksを、ステート変数のbooksに格納
   * useEffect2 -> booksの変更を検知したら、ローカルストレージにbooksを保存
   */
  const [books, setBooks] = useState([] as BookToRead[])
  useEffect(() => {
    const storedBooks = localStorage.getItem(APP_KEY)
    if (storedBooks) {
      setBooks(JSON.parse(storedBooks))
    }
  }, [])
  useEffect(() => {
    localStorage.setItem(APP_KEY, JSON.stringify(books))
  }, [books])
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
  const handleBookAdd = (book: BookDescription) => {
    const newBook: BookToRead = { ...book, id: Date.now(), memo: '' }
    const newBooks: BookToRead[] = [...books, newBook]
    setBooks(newBooks)
    setModalIsOpen(false)
  }
  const handleBookDelete = (id: number) => {
    /**
     * 送られてきたidを除いたbooksを生成
     * 新たなbooksをステートに更新させる
     */
    const newBooks = books.filter((b) => b.id !== id)
    setBooks(newBooks)
  }
  /**
   * ダイアログが開いているかどうかをステート管理
   */
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const handleAddClick = () => {
    setModalIsOpen(true)
  }
  const handleModalClose = () => {
    setModalIsOpen(false)
  }
  return (
    <div className="App">
      <section className="nav">
        <h1>読みたい本リスト</h1>
        <div className="button-like" onClick={handleAddClick}>
          本を追加
        </div>
      </section>
      <section className="main">{bookRows}</section>
      {/*
       * isOpen　        　-> ダイアログの開閉状態
       * onRequestClose -> ダイアログの背景を押下した時のイベント
       */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleModalClose}
        style={customStyles}
      >
        <BookSearchDialog maxResults={20} onBookAdd={(b) => handleBookAdd(b)} />
      </Modal>
    </div>
  )
}

export default App
