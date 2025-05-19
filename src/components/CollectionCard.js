import React from 'react';
import '../styles/CollectionCard.css';

function CollectionCard({ collection, onSelect, onView }) {
  // Available question count options
  const questionOptions = [10, 20, 30, 50];
  
  // Filter options based on collection size
  const availableOptions = questionOptions.filter(count => count <= collection.items.length);
  
  // If collection is smaller than smallest option, add its size
  const displayOptions = collection.items.length < 10 
    ? [collection.items.length, ...availableOptions]
    : availableOptions;
  
  // Remove duplicates (in case collection size equals one of our standard options)
  const uniqueOptions = [...new Set(displayOptions)].sort((a, b) => a - b);

  return (
    <div className="collection-card">
      <div className="collection-card-header">
        <h3>{collection.title}</h3>
        
        <button 
          className="view-collection-button"
          onClick={() => onView(collection.id)}
        >
          {collection.items.length} terms
        </button>
      </div>
      
      <div className="collection-card-footer">
        <div className="question-count-options">
          {uniqueOptions.map(count => (
            <button 
              key={count} 
              className="question-count-button"
              onClick={() => onSelect(collection.id, count)}
            >
              {count}
            </button>
          ))}
        </div>
        
      </div>
    </div>
  );
}

export default CollectionCard;