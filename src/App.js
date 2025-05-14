import React, { useState, useEffect } from 'react';
import SelectionScreen from './components/SelectionScreen';
import QuizScreen from './components/QuizScreen';
import collectionsData from './config/collections.json';
import './styles/App.css';

function App() {
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [numberOfQuestions, setNumberOfQuestions] = useState(3);
  const [questions, setQuestions] = useState([]);
  const [currentScreen, setCurrentScreen] = useState('selection');
  const [termStats, setTermStats] = useState({});

  // Load term stats from localStorage on initial load
  useEffect(() => {
    const savedStats = localStorage.getItem('termStats');
    if (savedStats) {
      setTermStats(JSON.parse(savedStats));
    }
  }, []);

  // Save term stats to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(termStats).length > 0) {
      localStorage.setItem('termStats', JSON.stringify(termStats));
    }
  }, [termStats]);

  const handleStartQuiz = (collectionId, questionCount) => {
    const collection = collectionsData.collections.find(c => c.id === collectionId);
    
    if (!collection || collection.items.length === 0) return;
    
    // Prepare all possible items
    const allItems = [...collection.items];
    
    // Sort items based on stats (prioritize unseen or incorrect items)
    allItems.sort((a, b) => {
      const aKey = `${a.key}-${a.value}`;
      const bKey = `${b.key}-${b.value}`;
      
      const aStats = termStats[aKey] || { seen: 0, incorrect: 0 };
      const bStats = termStats[bKey] || { seen: 0, incorrect: 0 };
      
      // Prioritize unseen items
      if (aStats.seen === 0 && bStats.seen > 0) return -1;
      if (bStats.seen === 0 && aStats.seen > 0) return 1;
      
      // Then prioritize items with more incorrect answers
      return (bStats.incorrect / Math.max(bStats.seen, 1)) - 
             (aStats.incorrect / Math.max(aStats.seen, 1));
    });
    
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
        isReverse
      };
    });
    
    setSelectedCollection(collection);
    setNumberOfQuestions(questionCount);
    setQuestions(quizQuestions);
    setCurrentScreen('quiz');
  };

  const handleQuizComplete = (updatedStats) => {
    // Update overall term stats with results from this quiz
    if (updatedStats) {
      setTermStats(prevStats => ({...prevStats, ...updatedStats}));
    }
    setCurrentScreen('selection');
  };

  return (
    <div className="App">
      <main>
        {currentScreen === 'selection' && (
          <SelectionScreen 
            collections={collectionsData.collections} 
            onStartQuiz={handleStartQuiz} 
          />
        )}
        {currentScreen === 'quiz' && (
          <QuizScreen 
            collection={selectedCollection}
            questions={questions}
            onComplete={handleQuizComplete}
          />
        )}
      </main>
    </div>
  );
}

export default App;