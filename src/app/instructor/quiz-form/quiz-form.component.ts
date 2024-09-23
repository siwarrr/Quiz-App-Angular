import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Question } from 'src/app/models/question';
import { Quiz } from 'src/app/models/quiz';
import { AuthService } from 'src/app/services/auth.service';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-quiz-form',
  templateUrl: './quiz-form.component.html',
  styleUrls: ['./quiz-form.component.css']
})
export class QuizFormComponent implements OnInit{

  isVisibleQuizModal = false;
  isOkLoading = false;
  current = 0;
  index = 'First-content';
  userId: string = '';
  formData: any = {
    quizName: '',
    quizSummary: '',
    questionName: ''
  };

  selectedTime: number = 0;
  selectedQuestionType: 'true/false' | 'single choice' | 'multiple choice' | 'short answer' | null = null;
  options: any[] = [];
  additionalOption: string = '';
  selectedOption: string | null = null;
  shortAnswer: string = '';
  questions: Question[] = [];
  showQuestionList = false;

  loading = false;
  quizzes: any[] = []; 
  selectedQuizResults: any[] = [];

  username: string = '';

  constructor(private quizService: QuizService, 
              private authService: AuthService,
              private message: NzMessageService,
              private cdr: ChangeDetectorRef,
              private modal: NzModalService,
              private router: Router
            ) {}

ngOnInit(): void {
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
  this.loadQuizzes(); 

  this.authService.getUsername().subscribe(
    (data) => {
      this.username = data.username;
    },
    (error) => {
      console.error('Error fetching username:', error);
    }
  );
}


showQuizModal(): void {
    console.log('Modal ouvert, étape actuelle:', this.current);
    console.log('Données du formulaire:', this.formData);  // Vérifiez si formData est bien initialisé
    this.isVisibleQuizModal = true;
    this.cdr.detectChanges();  // Forcer la détection de changements
}


  hideQuizModal(): void {
    this.isVisibleQuizModal = false;
    this.resetQuizForm();
  }

  // Add a new option
  addOption(): void {
    if (this.additionalOption) {
      this.options.push({ value: this.additionalOption, label: this.additionalOption });
      this.additionalOption = '';
    }
  }

  // Save the current question
  saveQuestion(): void {
    const correctAnswer = this.selectedQuestionType === 'multiple choice' 
      ? this.options.filter(option => option.selected).map(option => option.value)
      : this.selectedOption || this.shortAnswer;

    const newQuestion: Question = {
      question: this.formData.questionName,
      type: this.selectedQuestionType!,
      options: this.selectedQuestionType === 'multiple choice' || this.selectedQuestionType === 'single choice' ? this.options : [],
      correctAnswer: correctAnswer,
      _id: ''
    };

    this.questions.push(newQuestion);
    this.showQuestionList = true;
    this.resetQuestionForm();
  }

  // Check if the option is correct
  isCorrectAnswer(question: Question, optionValue: string): boolean {
    if (Array.isArray(question.correctAnswer)) {
      return question.correctAnswer.includes(optionValue);
    }
    return question.correctAnswer === optionValue;
  }

  // Reset the form to add another question
  addAnotherQuestion(): void {
    this.showQuestionList = false;
    this.resetQuestionForm();
  }

  // Reset the form data for the question
  resetQuestionForm(): void {
    this.formData.questionName = '';
    this.selectedQuestionType = null;
    this.options = [];
    this.selectedOption = null;
    this.shortAnswer = '';
  }

  resetQuizForm(): void {
    this.formData.quizName = '';
    this.formData.quizSummary = '';
    this.questions = [];
    this.selectedTime = 0;
  }

  pre(): void {
    if (this.current > 0) {
      this.current -= 1;
    }
  }
  
  next(): void {
    if (this.current < 2) {
      this.current++;
    }
    this.cdr.detectChanges(); // Forcer la détection du changement
  }
   

  done(): void {
    this.isOkLoading = true;
  
    console.log('Questions before sending:', this.questions); // Vérifiez que les questions sont bien présentes
  
    const quizData: Quiz = {
      name: this.formData.quizName,
      summary: this.formData.quizSummary,
      questions: this.questions.map(question => ({
        question: question.question,
        type: question.type,
        options: question.options ? question.options : [],
        correctAnswer: question.correctAnswer
      })),
      timing: this.formData.timing,
      numberOfQuestions: this.questions.length,
      instructor: [this.userId]  // Utilisation de l'ID de l'instructeur
    };
  
    console.log('Quiz data being sent:', quizData); // Log des données envoyées au backend
  
    // Appel à l'API pour créer le quiz
    this.quizService.createQuiz(quizData).subscribe(
      () => {
        this.message.success('Quiz created successfully!');
        this.isOkLoading = false;
        this.hideQuizModal();
      },
      (error) => {
        this.message.error('Failed to create the quiz. Please try again.');
        this.isOkLoading = false;
      }
    );
  }
  

  changeContent(): void {
    switch (this.current) {
      case 0:
        this.index = 'First-content';
        break;
      case 1:
        this.index = 'Second-content';
        break;
      case 2:
        this.index = 'third-content';
        break;
      default:
        this.index = 'error';
    }
  }

    // Fonction pour charger les quiz de l'instructeur
    loadQuizzes(): void {
      this.loading = true;
      this.quizService.getQuizzesForInstructor().subscribe(
        (quizzes: any[]) => {
          this.quizzes = quizzes;
          this.loading = false;
          console.log("quizzes list :", quizzes);
        },
        (error) => {
          this.message.error('Failed to load quizzes.');
          this.loading = false;
        }
      );
    }
  
    // Fonction pour rafraîchir la liste
    refreshQuizzes(): void {
      this.loadQuizzes();
    }

    viewQuizResults(quizId: string): void {
      this.loading = true;
      this.quizService.getQuizResults(quizId).subscribe(
        (results) => {
          this.selectedQuizResults = results;
    
          // Si aucun résultat, on affiche un message d'information dans le modal
          const modalContent = results.length > 0 ? `
            <ul>
              <li *ngFor="let result of selectedQuizResults">
                {{ result.studentId.username }} ({{ result.studentId.email }}): Score - {{ result.score }}, Performance - {{ result.performance }}
              </li>
            </ul>
          ` : '<p>No results found for this quiz.</p>';  // Si aucun résultat, afficher un message
    
          this.loading = false;
          this.modal.create({
            nzTitle: 'Student Results',
            nzContent: modalContent,  // Le contenu du modal
            nzFooter: null
          });
        },
        (error) => {
          // Afficher quand il y a une vraie erreur (par ex., problème de réseau)
          this.message.error('Failed to load quiz results.');
          this.loading = false;
        }
      );
    }
    
    logout() {
      //this.authService.logout();
      this.router.navigate(['/welcome/login']);
    }
}
