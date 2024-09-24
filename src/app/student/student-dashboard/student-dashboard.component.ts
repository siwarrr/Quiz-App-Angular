import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from 'src/app/services/auth.service';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit{

  username: string = '';
  quizzes: any[] = [];
  selectedQuiz: any = null;
  quizId: string = '' ;
  currentQuestionIndex: number = 0;
  selectedAnswers: any = {};
  
  constructor(private authService: AuthService,
              private quizService: QuizService,
              private modal: NzModalService,
              private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getUsername().subscribe(
      (data) => {
        this.username = data.username;
      },
      (error) => {
        console.error('Error fetching username:', error);
      }
    );

    // Récupérer la liste des quizzes disponibles
    this.quizService.getQuizzes().subscribe(
      (data) => {
        this.quizzes = data; // Stocker les quizzes dans la variable
      },
      (error) => {
        console.error('Error fetching quizzes:', error);
      }
    );
  }

  startQuiz(quizId: string): void {
    this.router.navigate([`student/quiz/${quizId}`]);  // Naviguer vers le composant QuizComponent avec l'ID du quiz
  }
    // Naviguer vers les quiz passés
    goToPastQuizzes() {
      this.router.navigate(['/past-quizzes']);
    }
  
    // Déconnecter l'utilisateur
    logout() {
      //this.authService.logout();
      this.router.navigate(['welcome/login']);
    }
}
