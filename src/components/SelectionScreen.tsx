import React, { useState } from 'react';
import CollectionCard from './CollectionCard';
import '../styles/SelectionScreen.css';
import Collections from '../types/Collections';
import Collection from '../types/Collection';
import Stats from '../types/Stats';

type SelectionScreenProps = {
  collections: Collections,
  stats: Stats,
  onViewCollection: (id: string) => void,
  onStartQuiz: (id: string, numberOfQuestions: number) => void
}

function SelectionScreen({ collections, stats, onViewCollection, onStartQuiz }: SelectionScreenProps) {
  return (
    <div className="selection-screen">
      <div className="collections-grid">
        {collections.map((collection: Collection,id: string) => {
          return (
            <CollectionCard
              key={id}
              collection={collection}
              stats={collection.getStats(stats)}
              onSelect={onStartQuiz}
              onView={onViewCollection}
            />
          );
        })}
      </div>
    </div>
  );
}

export default SelectionScreen;