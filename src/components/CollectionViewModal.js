import React, { useState, useEffect } from 'react';
import '../styles/CollectionViewModal.css';

function CollectionViewModal({ collection, onClose, searchTerm, onSearchChange }) {
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{collection.title} - Terms</h2>
          <button className="modal-close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-search">
          <input
            type="text"
            placeholder="Search terms..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="terms-table-container">
          <table className="terms-table">
            <thead>
              <tr>
                <th>Key</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr key={`${item.key}-${index}`}>
                    <td>{item.key}</td>
                    <td>{item.value}</td>
                  </tr>
                ))
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
    </div>
  );
}

export default CollectionViewModal;