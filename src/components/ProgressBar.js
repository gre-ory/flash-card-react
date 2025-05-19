import '../styles/ProgressBar.css';

function ProgressBar({ nbSuccess, nbFailure, nbQuestion, showPercent }) {

  var nbCompleted = nbSuccess + nbFailure;
  // var progressRate = isCompleted ? 100 : nbQuestion > 0 ? Math.round((nbCompleted / nbQuestion) * 100) : 0;
  var successRate = nbCompleted > 0 ? Math.round((nbSuccess / nbQuestion) * 100) : 0;
  var failureRate = nbCompleted > 0 ? Math.round((nbFailure / nbQuestion) * 100) : 0;

  return <div className="progress-bar">
    <div 
      className="success-fill" 
      style={{ width: `${successRate}%` }}
    >
      {showPercent && nbSuccess > 0 && <>{successRate}%</>}
      {!showPercent && <>&nbsp;</>}
    </div>
    <div 
      className="failure-fill" 
      style={{ width: `${failureRate}%` }}
    >
      {showPercent && nbFailure > 0 && <>{failureRate}%</>}
      {!showPercent && <>&nbsp;</>}
    </div>
  </div>
}

export default ProgressBar;