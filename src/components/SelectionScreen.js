import React, { useState } from 'react';
import CollectionCard from './CollectionCard';
import CollectionViewModal from './CollectionViewModal';
import '../styles/SelectionScreen.css';

function SelectionScreen({ collections, onStartQuiz }) {
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingCollection, setViewingCollection] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleStartQuiz = (collectionId, count) => {
    if (collectionId) {
      onStartQuiz(collectionId, count);
    }
  };

  const handleViewCollection = (collection) => {
    setViewingCollection(collection);
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setSearchTerm('');
  };

  return (
    <div className="selection-screen">
      
      <div className="collections-grid">
        {collections.map(collection => (
          <CollectionCard 
            key={collection.id}
            collection={collection}
            onSelect={handleStartQuiz}
            onView={() => handleViewCollection(collection)}
          />
        ))}
      </div>
      
      {showViewModal && viewingCollection && (
        <CollectionViewModal 
          collection={viewingCollection}
          onClose={closeViewModal}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      )}
    </div>
  );
}

export default SelectionScreen;