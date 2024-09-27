import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
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
  userId: string = '';
  quizResults: any = null;
  isResultModalVisible: boolean = false;
  isQuizCompleted: boolean = false;
  Array = Array; 
  correctAnswers: any[] = [];
  
  constructor(private route: ActivatedRoute, 
              private authService: AuthService,
              private quizService: QuizService,
              private cdr: ChangeDetectorRef
            ) {
            }

  ngOnInit(): void {
    // Récupérer l'ID du quiz depuis l'URL
    this.quizId = this.route.snapshot.paramMap.get('quizId') || '';

    // Appeler le service pour récupérer les détails du quiz
    this.quizService.getQuizById(this.quizId).subscribe((quizData) => {
      this.selectedQuiz = quizData;
      this.currentQuestionIndex = 0; // Commencer à la première question
    });

    this.authService.getCurrentUser().subscribe(
      (user: any) => {
        console.log('Current user:', user);
        if (user && user._id) {
          this.userId = user._id;
          console.log('User ID:', this.userId);
        } else {
          console.error('User ID not found');
        }
      },
      (error: any) => {
        console.error('Error getting current user:', error);
      }
    ); 
  }

  onMultipleChoiceChange(event: any, option: string): void {
    const selectedOptions = this.selectedAnswers[this.currentQuestionIndex] || [];
    if (event.target.checked) {
      // Ajouter l'option si elle n'est pas déjà sélectionnée
      selectedOptions.push(option);
    } else {
      // Retirer l'option si elle est désélectionnée
      const index = selectedOptions.indexOf(option);
      if (index !== -1) {
        selectedOptions.splice(index, 1);
      }
    }
    this.selectedAnswers[this.currentQuestionIndex] = selectedOptions;
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
      this.finishQuiz(this.userId);
    }
  }

  finishQuiz(studentId: string): void {
    if (!studentId) {
      console.error('Student ID not found!');
      return;
    }
  
    const submissionData = {
      quizId: this.quizId,
      studentId: studentId,
      answers: this.selectedAnswers
    };
  
    this.quizService.submitQuiz(submissionData).subscribe(response => {
      console.log('Résultats du quiz:', response); 
      
      // Ajout des types explicites pour 'question' et 'index'
      this.correctAnswers = this.selectedQuiz.questions.map((question: any, index: number) => {
        const learnerAnswer = this.selectedAnswers[index];
        const isCorrect = Array.isArray(learnerAnswer)
          ? this.areArraysEqual(learnerAnswer, question.correctAnswer)
          : this.normalizeAnswer(learnerAnswer) === this.normalizeAnswer(question.correctAnswer);
  
        return {
          question: question.question,
          correctAnswer: question.correctAnswer,
          learnerAnswer: learnerAnswer,
          isCorrect: isCorrect
        };
      });
  
      this.quizResults = response;
      this.isQuizCompleted = true; // Marquer le quiz comme terminé
      this.cdr.detectChanges(); // Rafraîchir la vue
    }, error => {
      console.error('Erreur lors de la soumission du quiz:', error);
    });
  }
  
  
  // Fonction pour normaliser les réponses en supprimant les espaces et en ignorant la casse
normalizeAnswer(answer: string): string {
  return answer ? answer.trim().toLowerCase() : ''; 
}

// Fonction pour comparer deux tableaux (en les normalisant et en ignorant l'ordre)
areArraysEqual(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) return false;

  // Normalisation et tri des tableaux pour les comparer
  const normalizedArr1 = arr1.map(this.normalizeAnswer).sort();
  const normalizedArr2 = arr2.map(this.normalizeAnswer).sort();

  return normalizedArr1.every((value, index) => value === normalizedArr2[index]);
}
  
}
