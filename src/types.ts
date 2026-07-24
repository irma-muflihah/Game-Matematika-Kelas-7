export type Topic = 'integers' | 'sets' | 'equations';

export interface Student {
  id: string;
  name: string;
  className: string;
}


export interface Score {
  id: string;
  studentName: string;
  className: string;
  topic: Topic;
  score: number;
  timeSpent: number; // in seconds
  timestamp: string;
}

export interface ProblemSolvingStep {
  diketahui: string[];
  ditanya: string;
  correctModel: string;
  modelOptions: string[];
  explanation: string;
}

export interface IntegerProblem {
  id: string;
  level: number;
  question: string;
  startPos: number;
  operation: 'add' | 'subtract';
  operand: number; // positive or negative
  targetPos: number;
  pedagogy: ProblemSolvingStep;
}

export interface SetProblem {
  id: string;
  level: number;
  question: string;
  universe: string[];
  setA: string[];
  setB: string[];
  operation: 'intersection' | 'union' | 'complement_a' | 'complement_b';
  correctElements: string[];
  pedagogy: ProblemSolvingStep;
}

export interface EquationProblem {
  id: string;
  level: number;
  question: string;
  leftX: number; // number of x's on left
  leftConstants: number; // constants on left
  rightX: number; // number of x's on right
  rightConstants: number; // constants on right
  solution: number; // value of x
  pedagogy: ProblemSolvingStep;
}
