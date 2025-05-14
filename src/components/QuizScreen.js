import React, { useState, useEffect } from 'react';
import QuizCard from './QuizCard';
import '../styles/QuizScreen.css';

function QuizScreen({ collection, questions, onComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [stats, setStats] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [visibleCards, setVisibleCards] = useState([0]); // Track which cards are visible

  // Initialize stats for each term
  useEffect(() => {
    const initialStats = {};
    questions.forEach(question => {
      const termKey = `${question.questionText}-${question.correctAnswer}`;
      initialStats[termKey] = initialStats[termKey] || {
        seen: 0,
        correct: 0,
        incorrect: 0
      };
    });
    setStats(initialStats);
  }, [questions]);

  const handleCardResult = (questionIndex, isCorrect) => {
    // Update score
    if (isCorrect) {
      setScore(score + 1);
    }
    
    // Update stats for this term
    const currentQuestion = questions[questionIndex];
    const termKey = `${currentQuestion.questionText}-${currentQuestion.correctAnswer}`;
    setStats(prevStats => {
      const updatedStats = { ...prevStats };
      updatedStats[termKey] = {
        seen: (updatedStats[termKey]?.seen || 0) + 1,
        correct: (updatedStats[termKey]?.correct || 0) + (isCorrect ? 1 : 0),
        incorrect: (updatedStats[termKey]?.incorrect || 0) + (isCorrect ? 0 : 1)
      };
      return updatedStats;
    });
    
    // Remove current card from visible cards
    setVisibleCards(prev => prev.filter(idx => idx !== questionIndex));
    
    // Move to next question or finish
    if (questionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(questionIndex + 1);
        // Show next card
        setTimeout(() => {
          setVisibleCards(prev => [...prev, questionIndex + 1]);
        }, 50);
      }, 300);
    } else {
      setTimeout(() => {
        setIsCompleted(true);
      }, 300);
    }
  };
  
  // Show final screen with results
  if (isCompleted) {
    return (
      <div className="quiz-complete">
        <h2>Quiz Complete!</h2>
        <div className="final-score">
          <p>Your score: {score} / {questions.length}</p>
          <p>Accuracy: {Math.round((score / questions.length) * 100)}%</p>
        </div>
        <button onClick={() => onComplete(stats)} className="finish-button">
          Return to Selection
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-screen">
      <div className="quiz-header">
        <h2>{collection.title} Quiz</h2>
        <div className="quiz-progress">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>

      <div className="cards-container">
        {questions.map((question, index) => (
          <div 
            key={index} 
            className={`card-animation-wrapper ${visibleCards.includes(index) ? 'visible' : ''} ${index === currentQuestionIndex ? 'current' : ''}`}
          >
            {/* Only render cards that are current or next to avoid performance issues with too many cards */}
            {(index >= currentQuestionIndex - 1 && index <= currentQuestionIndex + 1) && (
              <QuizCard 
                term={question.questionText}
                answer={question.correctAnswer}
                onResult={(isCorrect) => handleCardResult(index, isCorrect)}
                active={index === currentQuestionIndex}
              />
            )}
          </div>
        ))}
      </div>
      
      <div className="score-display">
        Score: {score} / {currentQuestionIndex}
      </div>
    </div>
  );
}

export default QuizScreen;