import React, { useState, useEffect } from 'react';
import QuizCard from './QuizCard';
import ResultBar from './ResultBar';
import '../styles/QuizScreen.css';

function QuizScreen({ collection, questions, onClose }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [nbSuccess, setNbSuccess] = useState(0);
  const [nbFailure, setNbFailure] = useState(0);
  const [result, setResult] = useState([]);
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

    // Update score
    if (isCorrect) {
      setNbSuccess(nbSuccess + 1);
      setResult([...result,true]);
      currentQuestion.onCorrect();
    } else {
      setNbFailure(nbFailure + 1);
      setResult([...result,false]);
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
  
  return (
    <div className="quiz-screen">
      
      <div className="quiz-header">
        <h2>{collection.title}</h2>
        <button className="button-close" onClick={onClose}>×</button>
      </div>

      <div className="quiz-content">
        { isCompleted 
          ? <div className="final-score">
              <p>
                <b>Score: {nbSuccess} / {nbQuestion} ( {successRate} % )</b>
              </p>
            </div>
          : <div className="cards-container">
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
                    questionNumber={currentQuestionIndex+1}
                    nbQuestion={nbQuestion}
                  />
                )}
              </div>
            ))}
          </div>
        }
      </div>

      <div className="quiz-footer">
        <ResultBar
          nbQuestion={nbQuestion}
          result={result}
        />
      </div>

    </div>
  );
}

export default QuizScreen;