import React, { useState, useEffect } from 'react';

import SelectionScreen from './SelectionScreen';
import QuizScreen from './QuizScreen';
import CollectionView from './CollectionView';

import collectionsData from '../config/collections.json';

import '../styles/App.css';

function App() {
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [numberOfQuestions, setNumberOfQuestions] = useState(3);
  const [questions, setQuestions] = useState([]);
  const [currentScreen, setCurrentScreen] = useState('selection');
  const [termStats, setTermStats] = useState({});

  // Load term stats from localStorage on initial load
  useEffect(() => {
      setTermStats(loadStats());
  }, []);

  const loadStats = () => {
    var jsonStats = localStorage.getItem('termStats');
    var stats = jsonStats ? JSON.parse(jsonStats) : {}
    collectionsData.collections.forEach(collection => {
      stats[collection.id] = stats[collection.id] || {}
      collection.items.forEach(item => {
        stats[collection.id][item.key] = { 
          ...{ group: 0, correct: 0, incorrect: 0 },
          ...stats[collection.id][item.key]
        };
      });
    });
    return stats
  }

  const saveStats = (stats) => {
    if (Object.keys(stats).length > 0) {
      localStorage.setItem('termStats', JSON.stringify(stats));
    } else {
      localStorage.removeItem('termStats');
    }
  }

  // useEffect(() => {
  //     console.log('[stats] (+) ', termStats['english-french'])
    
  // }, [termStats]);

  const onStartQuiz = (collectionId, questionCount) => {
    const collection = collectionsData.collections.find(c => c.id === collectionId);
    
    if (!collection || collection.items.length === 0) return;
    
    // Prepare all possible items
    const allItems = [...collection.items];

    // console.log(allItems);
    
    // Sort items based on stats (prioritize unseen or incorrect items)
    allItems.sort((a, b) => {
      
      const aStats = termStats[collectionId][a.key] || { group: 0, correct: 0, incorrect: 0 };
      const bStats = termStats[collectionId][b.key] || { group: 0, correct: 0, incorrect: 0 };
      
      // Prioritize first groups
      if (aStats.group < bStats.group) return -1;
      if (aStats.group > bStats.group) return 1;

      const aSeen = aStats.correct + aStats.incorrect;
      const bSeen = bStats.correct + bStats.incorrect;
      
      // Then unseen
      if (aSeen < bSeen) return -1;
      if (aSeen > bSeen) return 1;

      const aRate = aSeen > 0 ? Math.round( aStats.incorrect * 100 / aSeen ) : 0;
      const bRate = bSeen > 0 ? Math.round( bStats.incorrect * 100 / bSeen ) : 0;

      // Then incorrect items first
      return bRate - aRate;
    });

    console.log('sorted: ',allItems);
    
    // Select the top items based on questionCount
    const selectedItems = allItems.slice(0, Math.min(questionCount, allItems.length));
    
    // Shuffle the selected items to avoid predictable order
    const shuffledItems = [...selectedItems].sort(() => Math.random() - 0.5);
    
    // Determine direction (forward or reverse) for each question
    const quizQuestions = shuffledItems.map(item => {
      const isReverse = collection.reversible && Math.random() > 0.5;
      return {
        questionText: isReverse ? item.value : item.key,
        correctAnswer: isReverse ? item.key : item.value,
        isReverse,
        onCorrect: () => onCorrectTerm(collectionId, item.key),
        onIncorrect: () => onIncorrectTerm(collectionId, item.key),
      };
    });
    
    setSelectedCollection(collection);
    setNumberOfQuestions(questionCount);
    setQuestions(quizQuestions);
    setCurrentScreen('quiz');
  };

  const onCloseQuiz = () => {
    setSelectedCollection(null);
    setCurrentScreen('selection');
  };

  const onCorrectTerm = (collectionId, term) => {
    console.log(`[onCorrectTerm] >>> ${collectionId}.${term}`);
    setTermStats(prevStats => {
      if ( !prevStats[collectionId] ) { prevStats[collectionId] = {} }
      if ( !prevStats[collectionId][term] ) { prevStats[collectionId][term] = { group: 0, correct: 0, incorrect: 0 } }
      prevStats[collectionId][term].group = Math.min(prevStats[collectionId][term].group+1,5);
      prevStats[collectionId][term].correct++;
      console.log(`[onCorrectTerm] >>> >>> ${prevStats[collectionId][term].correct}`);
      saveStats(prevStats);
      return prevStats;
    });
  }

  const onIncorrectTerm = (collectionId, term) => {
    console.log(`[onIncorrectTerm] >>> ${collectionId}.${term}`);
    setTermStats(prevStats => {
      if ( !prevStats[collectionId] ) { prevStats[collectionId] = {} }
      if ( !prevStats[collectionId][term] ) { prevStats[collectionId][term] = { group: 0, correct: 0, incorrect: 0 } }
      prevStats[collectionId][term].group = Math.max(prevStats[collectionId][term].group-1,0);
      prevStats[collectionId][term].incorrect++;
      console.log(`[onIncorrectTerm] >>> >>> ${prevStats[collectionId][term].incorrect}`);
      saveStats(prevStats);
      return prevStats;
    });
  }

  const onViewCollection = (collectionId) => {
    const collection = collectionsData.collections.find(c => c.id === collectionId);
    if (!collection || collection.items.length === 0) return;
    setSelectedCollection(collection);
    setCurrentScreen('view');
  };

  const onCloseView = () => {
    setSelectedCollection(null);
    setCurrentScreen('selection');
  };

  var selectedStats = selectedCollection ? termStats[selectedCollection.id] || {} : null;

  return (
    <div className="App">
      <main>
        {currentScreen === 'selection' && (
          <SelectionScreen 
            collections={collectionsData.collections} 
            onViewCollection={onViewCollection}
            onStartQuiz={onStartQuiz} 
          />
        )}
        {currentScreen === 'view' && (
          <CollectionView  
            collection={selectedCollection}
            stats={selectedStats}
            onClose={onCloseView} 
          />
        )}
        {currentScreen === 'quiz' && (
          <QuizScreen 
            collection={selectedCollection}
            questions={questions}
            onClose={onCloseQuiz}
          />
        )}
      </main>
    </div>
  );
}

export default App;