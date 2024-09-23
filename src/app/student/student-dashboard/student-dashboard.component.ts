import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit{

  username: string = '';

  quizzes = [
    {
      id: 1,
      title: 'Math Quiz',
      description: 'Test your math skills with this basic arithmetic quiz.',
      duration: 30,
      questionsCount: 10,
    },
    {
      id: 2,
      title: 'Science Quiz',
      description: 'Explore the wonders of science with this challenging quiz.',
      duration: 45,
      questionsCount: 15,
    },
    {
      id: 3,
      title: 'History Quiz',
      description: 'A fun quiz to test your knowledge of historical events.',
      duration: 20,
      questionsCount: 8,
    }
  ];
  constructor(private authService: AuthService,
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
  }

  startQuiz(quizId: number): void {
    console.log('Starting quiz with ID:', quizId);
    // Logique pour démarrer le quiz ou rediriger l'étudiant vers la page du quiz
  }

    // Naviguer vers les quiz passés
    goToPastQuizzes() {
      this.router.navigate(['/past-quizzes']);
    }
  
    // Déconnecter l'utilisateur
    logout() {
      //this.authService.logout();
      this.router.navigate(['/login']);
    }
}
