import { useState, useEffect, useRef } from 'react'
import { BookDescription } from 'BookDescription'

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

export const useBookData = (
  title: string,
  author: string,
  maxResults: number,
) => {
  /**
   * setXXの関数呼び出しを通じてステート変数が変化すると、それを検知してコンポーネントの再レンダリングを行う。（つまり、コンポーネント関数が呼び出される）
   * handleTitleInputChangeの引数に'A'を入力すると、最初のuseState('')->は、useState('A')
   * ちなみに親コンポーネントから渡されるpropsの値が変更された場合も、子コンポーネントは再レンダリングされる
   */
  const [books, setBooks] = useState([] as BookDescription[])
  /**
   * 検索ロジック
   *  - isSearching -> 検索処理実行中であることを示すステート管理
   * useEffectを使ってステート変数の副作用を実装
   *  - useEffectの第二引数には、「副作用が依存するステート変数 or propsのプロパティ」の配列を渡す
   *  - この配列の中身が変更を検知した場合のみ、副作用を呼び出す。
   *  - つまり、isSearching, title, author, props.maxResultsの中で検知できるが、今回はisSearchingのみ検知させる
   */
  useEffect(() => {
    if (title || author) {
      const url = buildSearchUrl(title, author, maxResults)
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
  }, [title, author, maxResults])
  return books
  /* 複数の型の値を配列で返却して呼び出し元でデストラクチャリング（分割代入）で受け取るには、上記のように as const を付ける */
  // return [books, setIsSearching] as const
}
