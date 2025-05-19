import React, { useState } from 'react';
import CollectionCard from './CollectionCard';
import '../styles/SelectionScreen.css';

function SelectionScreen({ collections, onViewCollection, onStartQuiz }) {

  return (
    <div className="selection-screen">
      
      <div className="collections-grid">
        {collections.map(collection => (
          <CollectionCard 
            key={collection.id}
            collection={collection}
            onSelect={onStartQuiz}
            onView={onViewCollection}
          />
        ))}
      </div>
    </div>
  );
}

export default SelectionScreen;