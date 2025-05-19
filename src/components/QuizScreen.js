import React, { useState, useEffect } from 'react';
import QuizCard from './QuizCard';
import ProgressBar from './ProgressBar';
import '../styles/QuizScreen.css';

function QuizScreen({ collection, questions, onClose }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [nbSuccess, setNbSuccess] = useState(0);
  const [nbFailure, setNbFailure] = useState(0);
  const [completedCards, setCompletedCards] = useState([]); // Track which cards are completed
  const [isCompleted, setIsCompleted] = useState(false);

  const onNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsCompleted(true);
    }
  }

  const handleCardResult = (isCorrect) => {
    const currentQuestion = questions[currentQuestionIndex];

    console.log(`[result] Card ${currentQuestionIndex + 1} isCorrect:${isCorrect} nbSuccess:${nbSuccess} nbFailure:${nbFailure}`);
    // Update score
    if (isCorrect) {
      setNbSuccess(nbSuccess + 1);
      console.log(`[result] >>> currentQuestion.onCorrect`);
      currentQuestion.onCorrect();
    } else {
      setNbFailure(nbFailure + 1);
      console.log(`[result] >>> currentQuestion.onIncorrect`);
      currentQuestion.onIncorrect();
    }
    
    // Mark this card as completed
    setCompletedCards(prev => [...prev, currentQuestionIndex]);

    // Move to next question or finish
    setTimeout(onNextQuestion, 300);
  };

  var nbQuestion = questions.length;
  var nbCompleted = nbSuccess + nbFailure;
  var progressRate = isCompleted ? 100 : nbQuestion > 0 ? Math.round((nbCompleted / nbQuestion) * 100) : 0;
  var successRate = nbCompleted > 0 ? Math.round((nbSuccess / nbQuestion) * 100) : 0;
  var failureRate = nbCompleted > 0 ? Math.round((nbFailure / nbQuestion) * 100) : 0;
  
  // Show final screen with results
  if (isCompleted) {
    return (
      <div className="quiz-complete">
        <h2>Quiz Complete!</h2>
        <button className="button-close" onClick={onClose}>×</button>
        <div className="final-score">
          <p>Score: {nbSuccess} / {nbQuestion}</p>

          <ProgressBar
            nbQuestion={nbQuestion}
            nbSuccess={nbSuccess}
            nbFailure={nbFailure}
          />

        </div>

        <button onClick={onClose} className="button back-to-selection">
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
          Question {currentQuestionIndex + 1} of {nbQuestion}
        </div>
        <button className="button-close" onClick={onClose}>×</button>
      </div>

      <div className="cards-container">
        {questions.map((question, index) => (
          <div 
            key={index} 
            className={`card-animation-wrapper ${index === currentQuestionIndex ? 'current-card' : 'hidden-card'}`}
          >
            {/* Only render cards that are current or next to avoid performance issues with too many cards */}
            {(index >= currentQuestionIndex - 1 && index <= currentQuestionIndex + 1) && (
              <QuizCard 
                term={question.questionText}
                answer={question.correctAnswer}
                onResult={(isCorrect) => handleCardResult(isCorrect)}
                active={index === currentQuestionIndex}
              />
            )}
          </div>
        ))}
      </div>

      <ProgressBar
        nbQuestion={nbQuestion}
        nbSuccess={nbSuccess}
        nbFailure={nbFailure}
      />
      
    </div>
  );
}

export default QuizScreen;