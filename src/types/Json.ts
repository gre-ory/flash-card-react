
export type JsonTerm = {
  key: string,
  value: string
}

export type JsonTermStats = {
  term: string,
  group: number,
  correct: number,
  incorrect: number,
  times: number[]
}

export type JsonCollection = {
  id: string,
  title: string,
  reversible: boolean,
  items: JsonTerm[]
}

export type JsonCollectionStats = {
  collectionId: string,
  terms: JsonTermStats[]
}

export type JsonCollections = {
  collections: JsonCollection[]
}

export type JsonCollectionsStats = JsonCollectionStats[]
