import React, { useState, useEffect } from 'react';
import '../styles/CollectionView.css';

function CollectionView({ collection, stats, onClose }) {
  const [currentOrder, setOrder] = useState('');
  const [currentOrderDirection, setOrderDirection] = useState('');
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

  

  // sort current items
  const compareKey = (a,b) => {
    return a.key.localeCompare(b.key)
  }
  const compareValue = (a,b) => {
    return a.value.localeCompare(b.value)
  }

  const getStat = (a) => {
    return stats[a.key] || { group: 0, correct: 0, incorrect: 0 };
  }

  const compareGroup = (a,b) => {
    if ( getStat(a).group < getStat(b).group ) return -1;
    if ( getStat(a).group > getStat(b).group ) return 1;
    return 0;
  }

  const compareCorrect = (a,b) => {
    if ( getStat(a).correct < getStat(b).correct ) return -1;
    if ( getStat(a).correct > getStat(b).correct ) return 1;
    return 0;
  }

  const compareIncorrect = (a,b) => {
    if ( getStat(a).incorrect < getStat(b).incorrect ) return -1;
    if ( getStat(a).incorrect > getStat(b).incorrect ) return 1;
    return 0;
  }
  
  const getRate = (a) => {
    var stats = getStat(a);
    var nbSeen = stats.correct + stats.incorrect;
    if ( nbSeen > 0 ) {
      return Math.round((stats.correct / nbSeen) * 100);
    }
    return 0;
  }

  const compareRate = (a,b) => {
    if ( getRate(a) < getRate(b) ) return -1;
    if ( getRate(a) > getRate(b) ) return 1;
    return 0;
  }

  const compareItem = (a,b) => {
    var result = 0;
    switch ( currentOrder ) {
      case 'value':
        result = compareValue(a,b);
        break;
      case 'box':
        result = compareGroup(a,b);
        break;
      case 'ok':
        result = compareCorrect(a,b);
        break;
      case 'ko':
        result = compareIncorrect(a,b);
        break;
      case 'rate':
        result = compareRate(a,b);
        break;
    }
    if ( result === 0 ) {
      result = compareKey(a,b);
    }
    if ( currentOrderDirection === 'desc' ) {
      result = -1 * result;
    }
    return result;
  }
  
  console.log(`sort ${currentOrder} ${currentOrderDirection}`)
  filteredItems.sort(compareItem);

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

  const toggleOrder = (order) => {
    if ( currentOrder === order ) {
      if ( currentOrderDirection === 'asc' ) {
        console.log(` >>> ${order} desc`)
        setOrderDirection('desc');
      } else if ( currentOrderDirection === 'desc' ) {
        console.log(` >>> reset`)
        setOrder('');
        setOrderDirection('');
      }
    } else {
      console.log(` >>> ${order} asc`)
      setOrder(order);
      setOrderDirection('asc');
    }
  }

  const getThStyle = (order) => {
    if ( currentOrder === order ) {
      if ( currentOrderDirection === 'asc' ) {
        return 'order asc'
      } else if ( currentOrderDirection === 'desc' ) {
        return 'order desc'
      }
    }
    return ''
  }

  return (
    <div className="collection-content">
      <div className="collection-header">
        <h2>{collection.title}</h2>
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
              {['key','value','box','ok','ko','rate'].map((name, _) => {
                var key = name.toLowerCase()
                return <th 
                  className={getThStyle(key)} 
                  onClick={() => toggleOrder(key)}>
                    {name}
                </th>
              })}
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
                <td colSpan="6" className="no-results">
                  {searchTerm ? 'Not found' : 'Empty'}
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