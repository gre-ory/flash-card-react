import React from 'react';
import '../styles/CollectionCard.css';

function CollectionCard({ collection, stats, onSelect, onView }) {
  // Available question count options
  const questionOptions = [10, 20, 30, 50];
  
  // Filter options based on collection size
  var availableOptions = collection.items.length < 10
    ? [collection.items.length]
    : questionOptions.filter(count => count <= collection.items.length);
    
  return (
    <div className="collection-card">
      <div className="collection-card-header">
        <h3>{collection.title}</h3>

        <button 
          className="view-button"
          onClick={() => onView(collection.id)}
        >
          &#x1F441;
        </button>
      </div>
      
      <div className="collection-card-content">
        
        <div className="collection-boxes">
        {[0,1,2,3,4].map(boxIndex => {
          var count = collection.items.filter(item => {
            var box = (stats[item.key] || {}).group || 0;
            return box === boxIndex;
          }).length
          return <div key={boxIndex} className={`collection-box box-${boxIndex + 1}`}>
            {count}
          </div>
        })}
        </div>

        <div className="question-count-options">
          {availableOptions.map(count => (
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