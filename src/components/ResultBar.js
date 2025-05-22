import '../styles/ResultBar.css';

function ResultBar({ result, nbQuestion }) {

  var nbSuccess = result.filter(r => r === true).length;
  var nbCompleted = result.length;
  var rate = nbCompleted > 0 ? Math.round((nbSuccess / nbCompleted) * 100) : 0;

  return <div className="result-bar">
    <div className="details">
      {nbSuccess} / {nbCompleted}
    </div>
    <div className="results">
      {[...Array(nbQuestion)].map((_, index) => {
        var done = index < result.length;
        var correct = done ? result[index] === true : false;
        return <div 
          key={index} 
          className={`result-item ${done ? (correct ? 'correct' : 'incorrect' ) : 'undone'}`}
        ></div>
      })}
    </div>
    <div className="details">
      {rate}%
    </div>
  </div>
}

export default ResultBar;