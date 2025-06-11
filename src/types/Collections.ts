
import Collection, { NewCollection } from "./Collection"

import { JsonCollections } from "./Json";
import Term from "./Term";

// //////////////////////////////////////////////////
// helper

export function NewCollections(json: JsonCollections): Collections {
  const collections = new Collections();
  json.collections.forEach(jsonCollection => {
    const collection = NewCollection(jsonCollection);
    collections.collections.set(collection.id, collection);
  });

  const chiffreSon = collections.getCollection("chiffre-son")
  if (chiffreSon) {
    const collection = new Collection("1000", "1000", false);
    for ( var i = 0 ; i < 9999; i++ ) {
      if ( i < 100 ) {
        collection.terms.push(chiffreSon.getTerm(`${i}`));
      } else {
        const secondPart = i%100;
        const secondTerm = secondPart < 10 ? chiffreSon.getTerm(`0${secondPart}`) : chiffreSon.getTerm(`${secondPart}`);
        const firstPart = (i - i%100) / 100;
        const firstTerm = chiffreSon.getTerm(`${firstPart}`);
        if (firstTerm && secondTerm) {
          collection.terms.push(new Term(`${i}`, `${firstTerm.value} ${secondTerm.value}`));
        }
      }
    }
    collections.collections.set(collection.id, collection);
  }

  return collections;
}

// //////////////////////////////////////////////////
// collections

class Collections {
  collections: Map<string, Collection>

  // //////////////////////////////////////////////////
  // constructor

  constructor() {
    this.collections = new Map<string, Collection>();
  }

  // //////////////////////////////////////////////////
  // helper

  map<T>(callback: (value: Collection, key: string) => T): Array<T> {
    const result: Array<T> = [];
    this.collections.forEach((value, key) => {
      result.push(callback(value, key));
    });
    return result;
  }

  // //////////////////////////////////////////////////
  // get

  getCollection(id: string): Collection {
    const collection = this.collections.get(id);
    if ( collection === undefined ) {
      throw new Error(`unknown collection ${id}`)
    }
    return collection
  }

  // //////////////////////////////////////////////////
  // setter

  addCollection(id: string, title: string, reversible: boolean): Collection {
    const collection = new Collection(id, title, reversible);
    this.collections.set(id, collection);
    return collection;
  }
}

export default Collections;