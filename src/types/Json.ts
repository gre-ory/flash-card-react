
export type JsonTerm = {
  key: string,
  value: string
}

export type JsonTermStats = {
  id: string, // term
  gr: number, // group
  co: number, // correct
  in: number, // incorrect
  ti: number[] // times
}

export type JsonCollection = {
  id: string,
  title: string,
  reversible: boolean,
  items: JsonTerm[]
}

export type JsonCollectionStats = {
  id: string,         // collection id
  te: JsonTermStats[] // terms
}

export type JsonCollections = {
  collections: JsonCollection[]
}

export type JsonCollectionsStats = JsonCollectionStats[]
