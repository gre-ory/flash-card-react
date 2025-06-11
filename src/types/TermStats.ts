
import { JsonTermStats } from "./Json";

const minGroup = 1;
const maxGroup = 5;
const maxNbTime = 3;
const minMs = 100;
const maxMs = 10000;

const sanitizeMs = (ms: number): number => {
  return Math.round(Math.min(Math.max(ms, minMs), maxMs)/minMs) * minMs;
}

// //////////////////////////////////////////////////
// term stats

class TermStats {
  group: number;
  correct: number;
  incorrect: number;
  times: number[];
  

  // //////////////////////////////////////////////////
  // constructor

  constructor() {
    this.reset();
  }
  
  // //////////////////////////////////////////////////
  // json

  toJson(term: string): JsonTermStats {
    return {
      id: term,
      gr: this.group,
      co: this.correct,
      in: this.incorrect,
      ti: this.times
    };
  }

  // //////////////////////////////////////////////////
  // str

  str(): string {
    return `group: ${this.group}, correct: ${this.correct}, incorrect: ${this.incorrect}, rate: ${this.getSuccessRate()}%`
  }

  // //////////////////////////////////////////////////
  // getter

  getAvgTime(): number {
    if ( !this.times || this.times.length === 0 ) {
      return maxMs;
    }
    var sum: number = 0
    this.times.forEach((ms: number) => {
      sum += ms
    })
    return Math.round(sum / this.times.length);
  }

  getAvgTimeSeconds(): number {
    return Math.round(this.getAvgTime()/minMs)/10;
  }

  getTimeWeight(): number {
    // term is well known >>> weight = 1
    const knownWeight = 1;
    const knownTime = 500;
    // term is not known >>> weight = 16
    const unknownWeight = 16;
    const unknownTime = 2000;
    var ms = this.getAvgTime();
    ms = Math.max(ms,knownTime);
    ms = Math.min(ms,unknownTime);
    const percent = Math.round((ms - knownTime) * 100 / (unknownTime - knownTime));
    return (unknownWeight - knownWeight) * percent / 100 + knownWeight;
  }

  getGroupWeight(): number {
    switch (this.group) {
      case 1: return 16;
      case 2: return 8;
      case 3: return 4;
      case 4: return 2;
      case 5: return 1;
      default: return 0;
    }
  }

  getWeight(): number {
    return Math.round(10 * this.getGroupWeight() * this.getTimeWeight());
  }

  getSeen(): number {
    return this.correct + this.incorrect;
  }

  getSuccessRate(): number {
    const seen = this.getSeen()
    return seen > 0 ? Math.round((this.correct / seen) * 100) : 0;
  }

  // //////////////////////////////////////////////////
  // setter

  reset() {
    this.group = minGroup;
    this.correct = 0;
    this.incorrect = 0;
    this.times = [];
  }

  load(json: JsonTermStats) {
    this.group = Math.min(Math.max(json.gr || minGroup, minGroup), maxGroup);
    this.correct = Math.max(json.co || 0, 0);
    this.incorrect = Math.max(json.in || 0, 0);
    this.times = json.ti ? json.ti.slice(0,maxNbTime-1) : [];
  }

  flagAsCorrect(ms: number) {
    this.correct++;
    this.group = Math.min(this.group+1, maxGroup);
    this.addTime(ms);
  }

  flagAsIncorrect(ms: number) {
    this.incorrect++;
    // incorrect = move back to first group
    this.group = minGroup;
    this.addTime(ms);
  }

  addTime(ms: number) {
    this.times.unshift(sanitizeMs(ms));
    this.times = this.times.slice(0,maxNbTime);
  }

}

export default TermStats; 