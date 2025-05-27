import { JsonCollection, JsonCollectionStats, JsonTermStats } from "./Json";
import TermStats from "./TermStats";

// //////////////////////////////////////////////////
// collection stats

class CollectionStats {
  stats: Map<string,TermStats>

  // //////////////////////////////////////////////////
  // constructor

  constructor() {
    this.stats = new Map();
  }
  
  // //////////////////////////////////////////////////
  // json
  
  toJson(collectionId: string): JsonCollectionStats {
    const terms: JsonTermStats[] = [];
    Array.from(this.stats.entries()).forEach(([key,termStats]) => {
      terms.push(termStats.toJson(key));
    });
    return {
      collectionId: collectionId,
      terms: terms,
    }
  }

  // //////////////////////////////////////////////////
  // getter

  getTermStats(term:string): TermStats {
    var stat = this.stats.get(term)
    if ( !stat ) {
      stat = new TermStats()
      this.stats.set(term, stat);
    }
    return stat;
  }

  // //////////////////////////////////////////////////
  // setter

  reset() {
    this.stats = new Map<string,TermStats>();
  }

  flagAsCorrect(term:string, ms: number) {
    this.getTermStats(term).flagAsCorrect(ms);
  }

  flagAsIncorrect(term:string, ms: number) {
    this.getTermStats(term).flagAsIncorrect(ms);
  }
  
}
export default CollectionStats; 