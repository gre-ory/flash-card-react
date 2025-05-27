
// //////////////////////////////////////////////////
// question

class Question {
  question: string;
  answer: string;
  isReverse: boolean;
  onCorrect: (ms: number) => void;
  onIncorrect: (ms: number) => void;

  // //////////////////////////////////////////////////
  // constructor

  constructor(question: string, answer: string, isReverse: boolean, onCorrect: (ms: number) => void, onIncorrect: (ms: number) => void) {
    this.question = question;
    this.answer = answer;   
    this.isReverse = isReverse;
    this.onCorrect = onCorrect;
    this.onIncorrect = onIncorrect;
  }
}

export default Question; 