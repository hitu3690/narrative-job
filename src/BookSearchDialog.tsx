import React, { useState, useEffect } from 'react'
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
  /**
   * 検索ロジック
   *  - isSearching -> 検索処理実行中であることを示すステート管理
   * useEffectを使ってステート変数の副作用を実装
   *  - useEffectの第二引数には、「副作用が依存するステート変数 or propsのプロパティ」の配列を渡す
   *  - この配列の中身が変更を検知した場合のみ、副作用を呼び出す。
   *  - つまり、isSearching, title, author, props.maxResultsの中で検知できるが、今回はisSearchingのみ検知させる
   */
  const [isSearching, setIsSearching] = useState(false)
  useEffect(() => {
    if (isSearching) {
      const url = buildSearchUrl(title, author, props.maxResults)
      fetch(url)
        /* リクエストURLを生成してAPIコールし、レスポンスを返す */
        .then((res) => {
          console.log(url)
          return res.json()
        })
        /* レスポンス結果を整形して、booksを抽出 */
        .then((json) => {
          console.log(json)
          return extractBooks(json)
        })
        /* ステートの更新 */
        .then((books) => {
          console.log(books)
          setBooks(books)
        })
        .catch((err) => {
          console.log(err)
        })
    }
    setIsSearching(false)
  }, [isSearching])
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
/* リクエストするURLを整形 */
function buildSearchUrl(
  title: string,
  author: string,
  maxResults: number,
): string {
  let url = 'https://www.googleapis.com/books/v1/volumes?q='
  const conditions: string[] = []
  if (title) {
    conditions.push(`intitle: ${title}`)
  }
  if (author) {
    conditions.push(`inauthor: ${author}`)
  }
  return url + conditions.join('+') + `&maxResults=${maxResults}`
}
/* レスポンスされたJSONを整形 */
function extractBooks(json: any): BookDescription[] {
  const items: any[] = json.items
  return items.map((item: any) => {
    const { volumeInfo } = item
    return {
      title: volumeInfo.title,
      authors: volumeInfo.authors ? volumeInfo.authors.join(', ') : '',
      thumbnail: volumeInfo.imageLinks
        ? volumeInfo.imageLinks.smallThumbnail
        : '',
    }
  })
}

export default BookSearchDialog
