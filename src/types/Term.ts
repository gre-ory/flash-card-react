import CollectionStats from "./CollectionStats";
import TermStats from "./TermStats";
import { JsonTerm } from "./Json";

// //////////////////////////////////////////////////
// helper

export function NewTerm(json: JsonTerm): Term {
  const term = new Term(json.key, json.value);
  return term;
}

// //////////////////////////////////////////////////
// term

class Term {
  key: string
  value: string

  // //////////////////////////////////////////////////
  // constructor

  constructor(key:string, value:string) {
    this.key = key;
    this.value = value;
  }

  // //////////////////////////////////////////////////
  // getter

  getStats(collectionStats: CollectionStats): TermStats {
    return collectionStats.getTermStats(this.key);
  }
}

export default Term; 