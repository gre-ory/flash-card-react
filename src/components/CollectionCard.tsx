import React from 'react';
import '../styles/CollectionCard.css';
import Collection from '../types/Collection';
import CollectionStats from '../types/CollectionStats';

type CollectionCardProps = {
  key: string,
  collection: Collection,
  stats: CollectionStats,
  onSelect: any,
  onView: any
}

function CollectionCard({ collection, stats, onSelect, onView }: CollectionCardProps) {

  // Available question count options
  const questionOptions = [10, 20, 30, 50];
  
  // Filter options based on collection size
  var availableOptions = collection.terms.length < 10
    ? [collection.terms.length]
    : questionOptions.filter(count => count <= collection.terms.length);

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
        {[1,2,3,4,5].map(group => {
          var count = collection.terms.filter(term => {
            const termStats = term.getStats(stats);
            const termGroup = termStats.group;
            return group === termGroup;
          }).length
          return <div key={group} className={`collection-box box-${group}`}>
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