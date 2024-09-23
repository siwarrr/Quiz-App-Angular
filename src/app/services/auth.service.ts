import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError, catchError, tap } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  private apiUrl = 'http://127.0.0.1:3000/user';
  private loginURL = 'http://127.0.0.1:3000/user/login';
  private currentUserUrl = 'http://127.0.0.1:3000/user/current';


  register(user: User): Observable<any> {  
    let registerUrl: string;

    if (user.role === 'Student') {
      registerUrl = `${this.apiUrl}/registerStudent`;
    } else if (user.role === 'Instructor') {
      registerUrl = `${this.apiUrl}/registerInstructor`;
    } else {
      return throwError('Invalid role selected');
    }

    return this.http.post(registerUrl, user).pipe(
      catchError(this.handleError)
    );
  }

  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(this.loginURL, body, { headers }).pipe(
        tap(response => {
            if (response && response.token) {
                // Stocker le token dans le stockage local
                localStorage.setItem('token', response.token);

                // Stocker l'ID de l'utilisateur dans le stockage local
                localStorage.setItem('userId', response.userId);

                // Stocker le nom de l'utilisateur dans le stockage local
                localStorage.setItem('fullname', response.fullname);

                // Stocker l'e-mail de l'utilisateur dans le stockage local
                localStorage.setItem('email', response.email);

                console.log('Received Token:', response.token);  // Log the received token
                localStorage.setItem('token', response.token);
              }
            }),
        catchError(this.handleError)
    );
}

private handleError(error: HttpErrorResponse): Observable<never> {
  console.error('An error occurred:', error);
  return throwError('Something bad happened; please try again later.');
}

getUserRole(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Décodage du token JWT
    return decodedToken.role; // Récupération du rôle de l'utilisateur depuis le token décodé
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
} 

getUsername(): Observable<{ username: string }> {
  const token = localStorage.getItem('token'); // Récupérer le token JWT stocké localement

  if (!token) {
    return throwError('No token found');
  }

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`  // Ajouter le token JWT dans l'en-tête Authorization
  });

  // Appel à l'API /username pour récupérer le nom complet de l'utilisateur connecté
  return this.http.get<{ username: string }>(`${this.apiUrl}/`, { headers })
    .pipe(
      catchError(error => {
        console.error('Error fetching username:', error);
        return throwError('Error fetching username');
      })
    );
}

getCurrentUser(): Observable<any> {
  const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
  return this.http.get<any>(this.currentUserUrl, { headers }).pipe(
      tap(user => {
          if (user && user._id) {
              localStorage.setItem('userId', user._id);
          }
      }),
      catchError(this.handleError)
  );
}

}
