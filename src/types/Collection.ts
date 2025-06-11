
import CollectionStats from "./CollectionStats"
import Stats from "./Stats"
import Term, { NewTerm } from "./Term"
import { JsonCollection } from "./Json";

// //////////////////////////////////////////////////
// helper

export function NewCollection(json: JsonCollection): Collection {
  const collection = new Collection(json.id, json.title, json.reversible);
  json.items.forEach(jsonTerm => {
    const term = NewTerm(jsonTerm);
    collection.terms.push(term);
  });
  return collection;
}

// //////////////////////////////////////////////////
// collection

class Collection {
  id: string
  title: string
  reversible: boolean
  terms: Array<Term>

  // //////////////////////////////////////////////////
  // constructor

  constructor(id:string, title:string, reversible:boolean) {
    this.id = id;
    this.title = title;
    this.reversible = reversible;
    this.terms = new Array<Term>();
  }

  // //////////////////////////////////////////////////
  // get

  getTerm(key: string): Term {
    const term = this.terms.find(t => t.key === key);
    if ( term === undefined ) {
      throw new Error(`unknown term ${key}`)
    }
    return term
  }

  getStats(stats: Stats): CollectionStats {
    return stats.getCollectionStats(this.id);
  }

  selectRandomTerms(count: number, stats: CollectionStats): Term[] {
    const weights = new Array<number>();
    var totalWeight: number = 0;
    this.terms.forEach(term => {
      const termStats = stats.getTermStats(term.key);
      const termWeight = termStats.getWeight();
      totalWeight += termWeight;
      // console.log(`[prepare] (+) term ${term.key} / group ${termStats.group} / group.weight ${termStats.getGroupWeight()} / time ${termStats.getAvgTime()} / weight ${termWeight} / sumWeight ${sumWeight}`);
      weights.push(termWeight);
    });
    // console.log(`[prepare] totalWeight: ${totalWeight}`);
    // select count random numbers up to sumWeight
    const selectedTerms = new Array<Term>();
    for (let i = 0; i < count; i++) {
      var random = Math.floor(Math.random() * (totalWeight - 1)) + 1;
      // find the first weight that is greater than the random number
      var termIndex: number = 0;
      var sumWeight: number = 0;
      while (termIndex < weights.length && random > sumWeight + weights[termIndex]) {
        sumWeight += weights[termIndex];
        termIndex++;
      }
      // add the term to the selected terms
      if (termIndex < this.terms.length) {
        const term = this.terms[termIndex];
        const termWeight = weights[termIndex];
        // console.log(`[random] >>> termIndex ${termIndex} / term ${term.key} / weight ${termWeight}`);
        selectedTerms.push(term);
        // avoid duplicates
        weights[termIndex] = 0;
        totalWeight -= termWeight;
      } else {
        throw new Error(`random term selection failed: ${random} / ${totalWeight} / ${weights.length}`);
      }
    }
    // shuffle the selected terms
    const shuffledTerms = [...selectedTerms].sort(() => Math.random() - 0.5);

    return shuffledTerms;
  }
}

export default Collection; 