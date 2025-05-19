import React, { useState, useEffect } from 'react';
import '../styles/CollectionView.css';

function CollectionView({ collection, stats, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredItems, setFilteredItems] = useState([]);
  const itemsPerPage = 10;
  
  // Filter items when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredItems(collection.items);
    } else {
      const term = searchTerm.toLowerCase().trim();
      const filtered = collection.items.filter(item => 
        item.key.toLowerCase().includes(term) || 
        item.value.toLowerCase().includes(term)
      );
      setFilteredItems(filtered);
    }
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, collection.items]);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredItems.length);
  const currentItems = filteredItems.slice(startIndex, endIndex);
  
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="collection-content">
      <div className="collection-header">
        <h2>{collection.title} - Terms</h2>
        <button className="button-close" onClick={onClose}>×</button>
      </div>
      
      <div className="collection-search">
        <input
          type="text"
          placeholder="Search terms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="collection-table-container">
        <table className="collection-table">
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
              <th>Group</th>
              <th>Correct</th>
              <th>Incorrect</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => {
                var group = stats[item.key].group;
                var nbCorrect = stats[item.key].correct;
                var nbIncorrect = stats[item.key].incorrect;
                var nbSeen = nbCorrect + nbIncorrect;
                var rate = nbSeen > 0 ? Math.round((nbCorrect / nbSeen) * 100) : 0;
                return <tr key={`${item.key}-${index}`}>
                  <td>{item.key}</td>
                  <td>{item.value}</td>
                  <td>{group}</td>
                  <td>{nbCorrect}</td>
                  <td>{nbIncorrect}</td>
                  <td>{rate}%</td>
                </tr>
              })
            ) : (
              <tr>
                <td colSpan="2" className="no-results">
                  {searchTerm ? 'No matching terms found' : 'No terms in this collection'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => goToPage(currentPage - 1)} 
            disabled={currentPage === 1}
            className="pagination-button"
          >
            &laquo; Prev
          </button>
          
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          
          <button 
            onClick={() => goToPage(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next &raquo;
          </button>
        </div>
      )}
    </div>
  );
}

export default CollectionView;