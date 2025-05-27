import React, { useState, useEffect } from 'react';

import SelectionScreen from './SelectionScreen';
import QuizScreen from './QuizScreen';
import CollectionView from './CollectionView';

import collectionsData from '../config/collections.json';

import Collections, { NewCollections } from '../types/Collections';
import Collection from '../types/Collection';
import Term from '../types/Term';
import Stats from '../types/Stats';

import { JsonCollections, JsonCollectionsStats, JsonCollectionStats, JsonTermStats } from '../types/Json';

import '../styles/App.css';
import Question from '../types/Question';

const StatsKey = 'stats';

function App() {
  const [collections, setCollections] = useState();
  const [stats,setStats] = useState(undefined);
  const [selectedCollection, setSelectedCollection] = useState(undefined);
  const [numberOfQuestions, setNumberOfQuestions] = useState(3);
  const [questions, setQuestions] = useState([]);
  const [currentScreen, setCurrentScreen] = useState('selection');
  // const [termStats, setTermStats] = useState({});

  // Load term stats from localStorage on initial load
  useEffect(() => {
    const collections = loadCollections();
    const stats = collections ? loadStats(collections) : new Stats();
    setCollections(collections);
    setStats(stats);
  }, [collectionsData]);

  const loadCollections = () => {
    const jsonCollections: JsonCollections = collectionsData;
    const collections = NewCollections(jsonCollections);
    return collections;
  };

  const loadStats = (collections: Collections) => {
    const stats = new Stats();  
    const rawStats = localStorage.getItem(StatsKey) || '';
    if (rawStats !== '') {
      const jsonStats: JsonCollectionsStats = JSON.parse(rawStats);
      (collections as Collections).collections.forEach((collection: Collection) => {
        const jsonCollectionStats: JsonCollectionStats = jsonStats.find(item => item.collectionId === collection.id) || {} as JsonCollectionStats;
        const collectionStats = collection.getStats(stats);
        collection.terms.forEach(term => {
          const jsonTermStats: JsonTermStats = ( jsonCollectionStats.terms || [] as JsonTermStats[] ).find(item => item.term === term.key) || {} as JsonTermStats;
          const termStats = term.getStats(collectionStats);
          termStats.load(jsonTermStats);
        });
      });
    }
    return stats;
  }

  const saveStats = (stats:Stats) => {
    if (stats) {
      localStorage.setItem(StatsKey, JSON.stringify(stats.toJson()));
    } else {
      localStorage.removeItem(StatsKey);
    }
  }

  const onStartQuiz = (collectionId, questionCount) => {
    const collection = (collections as Collections).getCollection(collectionId);
    
    if (!collection || collection.terms.length === 0) return;
    const collectionStats = collection.getStats(stats);

    const shuffledTerms = collection.selectRandomTerms(questionCount, collectionStats);
    
    // Determine direction (forward or reverse) for each question
    const quizQuestions = shuffledTerms.map((term: Term): Question => {
      const isReverse = collection.reversible && Math.random() > 0.5;
      const question = isReverse ? term.value : term.key;
      const answer = isReverse ? term.key : term.value;
      return new Question(
        question, 
        answer, 
        isReverse,
        (ms: number) => onCorrectTerm(collectionId, term.key, ms),
        (ms: number) => onIncorrectTerm(collectionId, term.key, ms),
      );
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

  const onCorrectTerm = (collectionId: string, term: string, ms: number) => {
    setStats(prev => {
      const termStats = (prev as Stats).getTermStats(collectionId, term);
      termStats.flagAsCorrect(ms);
      saveStats(prev);
      return prev;
    });
  }

  const onIncorrectTerm = (collectionId: string, term: string, ms: number) => {
    setStats(prev => {
      const termStats = (prev as Stats).getTermStats(collectionId, term);
      termStats.flagAsIncorrect(ms);
      saveStats(prev);
      return prev;
    });
  }

  const onViewCollection = (collectionId) => {
    const collection = (collections as Collections).getCollection(collectionId);
    if (!collection || collection.terms.length === 0) return;
    setSelectedCollection(collection);
    setCurrentScreen('view');
  };

  const onCloseView = () => {
    setSelectedCollection(null);
    setCurrentScreen('selection');
  };

  

  const wrap = (elt:any) => {
    return <div className="App">
      <main>
        {elt}
      </main>
    </div>
  }

  if (!collections) {
    return wrap(<span>Loading...</span>);
  }
  console.log(`[view] current-screen = ${currentScreen}`)

  if (currentScreen === 'quiz') {
    return wrap(
      <QuizScreen 
        collection={selectedCollection}
        questions={questions}
        onClose={onCloseQuiz}
      />
    );
  } else if (currentScreen === 'view') {
    var selectedStats = (stats as Stats).getCollectionStats(selectedCollection.id);
    return wrap(
      <CollectionView  
        collection={selectedCollection}
        collectionStats={selectedStats}
        onClose={onCloseView} 
      />
    );
  } else {
    // default
    return wrap(
      <SelectionScreen 
        collections={collections} 
        onViewCollection={onViewCollection}
        stats={stats}
        onStartQuiz={onStartQuiz} 
      />
    );
  }
}

export default App;