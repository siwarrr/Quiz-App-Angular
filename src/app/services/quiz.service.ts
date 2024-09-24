import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  private apiUrl = 'http://localhost:3000/quiz';

  constructor(private http: HttpClient) { }

    // Fonction pour obtenir les en-têtes avec le token
    private getAuthHeaders(): HttpHeaders {
      const token = localStorage.getItem('token'); // Obtenez le token depuis le localStorage ou autre méthode
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // En-tête Authorization avec JWT
      });
    }
    
    // Créer un quiz
    createQuiz(quizData: any): Observable<any> {
      const headers = this.getAuthHeaders();
      return this.http.post(`${this.apiUrl}/create`, quizData, { headers });
    }
  
  // Mettre à jour un quiz par ID
  updateQuiz(quizId: string, quizData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.apiUrl}/update/${quizId}`, quizData, { headers });
  }

  // Récupérer un quiz par ID
  getQuizById(quizId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/${quizId}`, { headers });
  }

  // Récupérer toutes les questions d'un quiz
  getQuestionsByQuizId(quizId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/${quizId}/questions`, { headers });
  }

  // Récupérer le nombre de questions dans un quiz
  getNumberOfQuestionsInQuiz(quizId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/${quizId}/questionCount`, { headers });
  }

  // Soumettre un quiz
  submitQuiz(submissionData: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}/submit`, submissionData, { headers });
  }

  // Supprimer un quiz
  deleteQuiz(quizId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.apiUrl}/delete/${quizId}`, { headers });
  }

  // Obtenir la liste des quiz d'un instructeur
  getQuizzesForInstructor(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/instructor/quizzes`, { headers });
  }

  // Récupérer les résultats des étudiants pour un quiz
  getQuizResults(quizId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/quiz/${quizId}/results`, { headers });
  }

  // Récupérer tous les quizzes disponibles
  getQuizzes(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/available`, { headers });
  }
}
