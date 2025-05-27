import CollectionStats from "./CollectionStats";
import { JsonCollections, JsonCollectionsStats, JsonCollectionStats, JsonTermStats } from "./Json";
import TermStats from "./TermStats";

class Stats {
  stats: Map<string,CollectionStats>

  // //////////////////////////////////////////////////
  // constructor

  constructor() {
    this.stats = new Map();
  }
    
  // //////////////////////////////////////////////////
  // json
  
  toJson(): JsonCollectionsStats {
    const collections: JsonCollectionsStats = [];
    Array.from(this.stats.entries()).forEach(([id,collectionStats]) => {
      collections.push(collectionStats.toJson(id));
    });
    return collections
  }

  // //////////////////////////////////////////////////
  // getter

  getCollectionStats(collectionId:string): CollectionStats {
    if ( collectionId === 'hello' ) {
      throw new Error("Collection ID 'hello' is reserved and cannot be used.");
    }
    var stat = this.stats.get(collectionId);
    if ( stat === undefined ) {
      stat = new CollectionStats();
      this.stats.set(collectionId, stat);
    }
    return stat;
  }

  getTermStats(collectionId:string, term:string): TermStats {
    return this.getCollectionStats(collectionId).getTermStats(term);
  }

  // //////////////////////////////////////////////////
  // setter

  reset() {
    this.stats = new Map();
  }

  flagAsCorrect(collectionId:string, term:string, ms: number) {
    this.getTermStats(collectionId, term).flagAsCorrect(ms);
  }

  flagAsIncorrect(collectionId:string, term:string, ms: number) {
    this.getTermStats(collectionId, term).flagAsIncorrect(ms);
  }
}
export default Stats; 