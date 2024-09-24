import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit{

  quizId: string = '';
  selectedQuiz: any = null;
  currentQuestionIndex: number = 0;
  selectedAnswers: any = {};

  constructor(private route: ActivatedRoute, 
              private quizService: QuizService
            ) {}

  ngOnInit(): void {
    // Récupérer l'ID du quiz depuis l'URL
    this.quizId = this.route.snapshot.paramMap.get('quizId') || '';

    // Appeler le service pour récupérer les détails du quiz
    this.quizService.getQuizById(this.quizId).subscribe((quizData) => {
      this.selectedQuiz = quizData;
      this.currentQuestionIndex = 0; // Commencer à la première question
    });
  }

  // Méthode pour gérer la sélection des réponses (adaptée à votre code)
  submitAnswer() {
    const currentQuestion = this.selectedQuiz.questions[this.currentQuestionIndex];
    // Sauvegarder les réponses sélectionnées
    this.selectedAnswers[currentQuestion._id] = this.selectedAnswers;
  }

  // Méthode pour naviguer entre les questions
  nextQuestion(): void {
    if (this.currentQuestionIndex < this.selectedQuiz.questions.length - 1) {
      this.currentQuestionIndex++;
    } else {
      this.finishQuiz();
    }
  }

  finishQuiz(): void {
    console.log('Quiz terminé, réponses sélectionnées:', this.selectedAnswers);
    // Logique pour soumettre le quiz ou calculer le score
  }
  
}
