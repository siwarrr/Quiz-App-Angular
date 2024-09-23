import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, NonNullableFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

  errorMessage: string = '';
  showAlert: boolean = false;

  validateForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
  }> = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      this.login();
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  login() {
    if (this.validateForm.valid) {
      const { email, password } = this.validateForm.value;
    
      if (email && password) {
        this.authService.login(email, password).subscribe(
          (response) => {
            console.log('Response from login:', response);
            localStorage.setItem('auth_token', response.token);
    
            if (response.role === 'Student') {
              this.router.navigate(['/student']);
            } else if (response.role === 'Instructor') {
              this.router.navigate(['/instructor']);
            } else {
              console.error('Unknown role:', response.role);
            }
            this.showAlert = false;
          },
          (error) => {
            console.error('Login error:', error);
            if (error.status === 401) {
              this.errorMessage = 'Incorrect email or password. Please try again.';
              this.showAlert = true;
              this.createMessage('error', this.errorMessage);
            } else {
              this.errorMessage = 'Error during login. Please try again.';
              this.showAlert = true;
              this.createMessage('error', this.errorMessage);
            }         
          }
        );
      }
    }
  }
  
  createMessage(type: string, message: string): void {
    this.message.create(type, message);
  }
  constructor(private fb: NonNullableFormBuilder,
              private authService: AuthService, 
              private message: NzMessageService,
              private router: Router
  ) {}
}
