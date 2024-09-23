import { Question } from "./question";

export interface Quiz {
    name: string;
    summary: string;
    questions: Question[]; 
    timing: number;
    numberOfQuestions: number;
    instructor: string[];  
}
