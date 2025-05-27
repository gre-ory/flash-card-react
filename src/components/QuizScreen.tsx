import React, { useState, useEffect } from 'react';
import QuizCard from './QuizCard';
import ResultBar from './ResultBar';
import '../styles/QuizScreen.css';
import Collection from '../types/Collection';
import Question from '../types/Question';

type QuizScreenProps = {
  collection: Collection,
  questions: Question[],
  onClose: () => void,
}

function QuizScreen({ collection, questions, onClose }: QuizScreenProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [nbSuccess, setNbSuccess] = useState(0);
  const [nbFailure, setNbFailure] = useState(0);
  const [result, setResult] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const onNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsCompleted(true);
    }
  }

  const handleCardResult = (isCorrect: boolean, ms: number) => {
    const currentQuestion = questions[currentQuestionIndex];

    // Update score
    if (isCorrect) {
      setNbSuccess(nbSuccess + 1);
      setResult([...result,true]);
      currentQuestion.onCorrect(ms);
    } else {
      setNbFailure(nbFailure + 1);
      setResult([...result,false]);
      currentQuestion.onIncorrect(ms);
    }
    
    // Move to next question or finish
    setTimeout(onNextQuestion, 300);
  };

  var nbQuestion = questions.length;
  var nbCompleted = nbSuccess + nbFailure;
  var successRate = nbCompleted > 0 ? Math.round((nbSuccess / nbQuestion) * 100) : 0;
  
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
            {questions.map((question: Question, index: number) => (
              <div 
                key={index} 
                className={`card-animation-wrapper ${index === currentQuestionIndex ? 'current-card' : 'hidden-card'}`}
              >
                {/* Only render cards that are current or next to avoid performance issues with too many cards */}
                {(index >= currentQuestionIndex - 1 && index <= currentQuestionIndex + 1) && (
                  <QuizCard 
                    question={question.question}
                    answer={question.answer}
                    onResult={handleCardResult}
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