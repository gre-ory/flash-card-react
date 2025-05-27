import React, { useState, useEffect } from 'react';
import '../styles/CollectionView.css';
import Collection from '../types/Collection';
import CollectionStats from '../types/CollectionStats';
import Term from '../types/Term';
import TermStats from '../types/TermStats';

type CollectionViewProps = {
  collection: Collection,
  collectionStats: CollectionStats,
  onClose: () => void
}

function CollectionView({ collection, collectionStats, onClose }: CollectionViewProps) {
  const [currentOrder, setOrder] = useState('');
  const [currentOrderDirection, setOrderDirection] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredItems, setFilteredItems] = useState([] as Term[]);
  const itemsPerPage = 10;
  
  // Filter items when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredItems(collection.terms);
    } else {
      const search = searchTerm.toLowerCase().trim();
      const filtered = collection.terms.filter((term: Term) => 
        term.key.toLowerCase().includes(search) || 
        term.value.toLowerCase().includes(search)
      );
      setFilteredItems(filtered);
    }
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, collection.terms]);

  

  // sort current items
  const compareKey = (a: Term, b: Term): number => {
    return a.key.localeCompare(b.key)
  }
  const compareValue = (a: Term, b: Term): number => {
    return a.value.localeCompare(b.value)
  }

  const getStat = (a: Term): TermStats => {
    return a.getStats(collectionStats);
  }

  const compareGroup = (a: Term, b: Term): number => {
    if ( getStat(a).group < getStat(b).group ) return -1;
    if ( getStat(a).group > getStat(b).group ) return 1;
    return 0;
  }

  const compareCorrect = (a: Term, b: Term): number => {
    if ( getStat(a).correct < getStat(b).correct ) return -1;
    if ( getStat(a).correct > getStat(b).correct ) return 1;
    return 0;
  }

  const compareIncorrect = (a: Term, b: Term): number => {
    if ( getStat(a).incorrect < getStat(b).incorrect ) return -1;
    if ( getStat(a).incorrect > getStat(b).incorrect ) return 1;
    return 0;
  }
  
  const compareRate = (a: Term, b: Term): number => {
    if ( getStat(a).getSuccessRate() < getStat(b).getSuccessRate() ) return -1;
    if ( getStat(a).getSuccessRate() > getStat(b).getSuccessRate() ) return 1;
    return 0;
  }
  
  const compareAvgTime = (a: Term, b: Term): number => {
    if ( getStat(a).getAvgTime() < getStat(b).getAvgTime() ) return -1;
    if ( getStat(a).getAvgTime() > getStat(b).getAvgTime() ) return 1;
    return 0;
  }
  
  const compareWeight = (a: Term, b: Term): number => {
    if ( getStat(a).getWeight() < getStat(b).getWeight() ) return -1;
    if ( getStat(a).getWeight() > getStat(b).getWeight() ) return 1;
    return 0;
  }

  const compareItem = (a: Term, b: Term): number => {
    var result: number = 0;
    switch ( currentOrder ) {
      case 'value':
        result = compareValue(a,b);
        break;
      case 'group':
        result = compareGroup(a,b);
        break;
      case 'correct':
        result = compareCorrect(a,b);
        break;
      case 'incorrect':
        result = compareIncorrect(a,b);
        break;
      case 'rate':
        result = compareRate(a,b);
        break;
      case 'time':
        result = compareAvgTime(a,b);
        break;
      case 'weight':
        result = compareWeight(a,b);
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
  
  (filteredItems as Term[]).sort(compareItem);

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredItems.length);
  const currentTerms = ( filteredItems as Term[] ).slice(startIndex, endIndex);
  
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const toggleOrder = (order: string) => {
    if ( currentOrder === order ) {
      if ( currentOrderDirection === 'asc' ) {
        setOrderDirection('desc');
      } else if ( currentOrderDirection === 'desc' ) {
        setOrder('');
        setOrderDirection('');
      }
    } else {
      setOrder(order);
      setOrderDirection('asc');
    }
  }

  const getThStyle = (order: string): string => {
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
              <th 
                className={getThStyle('key')} 
                onClick={() => toggleOrder('key')}>
                  key
              </th>
              <th 
                className={getThStyle('value')} 
                onClick={() => toggleOrder('value')}>
                  value
              </th>
              <th 
                className={getThStyle('correct')} 
                onClick={() => toggleOrder('correct')}
                title='number of correct answers'>
                  ok
              </th>
              <th 
                className={getThStyle('incorrect')} 
                onClick={() => toggleOrder('incorrect')}
                title='number of incorrect answers'>
                  ko
              </th>
              <th 
                className={getThStyle('rate')} 
                onClick={() => toggleOrder('rate')}
                title='success rate'>
                  %
              </th>
              <th 
                className={getThStyle('time')} 
                onClick={() => toggleOrder('time')}
                title='avg time'>
                  t
              </th>
              <th 
                className={getThStyle('group')} 
                onClick={() => toggleOrder('group')}
                title='group'>
                  gr
              </th>
              <th 
                className={getThStyle('weight')} 
                onClick={() => toggleOrder('weight')}
                title='weight'>
                  w
              </th>
            </tr>
          </thead>
          <tbody>
            {currentTerms.length > 0 ? (
              currentTerms.map((term: Term, index: number) => {
                const termStats = term.getStats(collectionStats);
                return <tr key={`${index}`}>
                  <td>{term.key}</td>
                  <td>{term.value}</td>
                  <td>{termStats.correct}</td>
                  <td>{termStats.incorrect}</td>
                  <td>{termStats.getSuccessRate()}%</td>
                  <td>{termStats.getAvgTimeSeconds()}s</td>
                  <td>{termStats.group}</td>
                  <td>{termStats.getWeight()}</td>
                </tr>
              })
            ) : (
              <tr>
                <td colSpan="8" className="no-results">
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