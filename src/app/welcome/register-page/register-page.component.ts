import { Component } from '@angular/core';
import { FormGroup, FormControl, AsyncValidatorFn, AbstractControl, ValidatorFn, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Observable, Observer } from 'rxjs';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent {
  validateForm: FormGroup<{
    username: FormControl<string>;
    email: FormControl<string>;
    radioValue: FormControl<string>;
    password: FormControl<string>;
    confirm: FormControl<string>;
  }>;
  radioValue = 'Student';
  // current locale is key of the nzAutoTips
  // if it is not found, it will be searched again with `default`
  autoTips: Record<string, Record<string, string>> = {
    'zh-cn': {
      required: '必填项'
    },
    en: {
      required: 'Input is required'
    },
    default: {
      email: 'The input is not valid email'
    }
  };

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  validateConfirmPassword(): void {
    setTimeout(() => this.validateForm.controls.confirm.updateValueAndValidity());
  }

  userNameAsyncValidator: AsyncValidatorFn = (control: AbstractControl) =>
    new Observable((observer: Observer<MyValidationErrors | null>) => {
      setTimeout(() => {
        if (control.value === 'JasonWood') {
          observer.next({
            duplicated: { 'zh-cn': ``, en: `The username is redundant!` }
          });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    });

  confirmValidator: ValidatorFn = (control: AbstractControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  constructor(private fb: NonNullableFormBuilder, private _auth: AuthService, private router: Router) {
    // use `MyValidators`
    const { required, maxLength, minLength, email } = MyValidators;
    this.validateForm = this.fb.group({
      username: ['', [required, maxLength(12), minLength(6)], [this.userNameAsyncValidator]],
      email: ['', [required, email]],
      radioValue: ['Student', [Validators.required]],
      password: ['', [required]],
      confirm: ['', [this.confirmValidator]]
    });
  }

  register() {
    if (this.validateForm.valid) {
      const formData: User = {
        username: this.validateForm.value.username!,
        email: this.validateForm.value.email!,
        password: this.validateForm.value.password!,
        role: this.validateForm.value.radioValue as 'Student' | 'Instructor'  
      };

      this._auth.register(formData).subscribe(
        _res => {
          this.router.navigate(['/welcome/login']);
        },
        error => {
          console.error('Error:', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
  
}

export type MyErrorsOptions = { 'zh-cn': string; en: string } & Record<string, NzSafeAny>;
export type MyValidationErrors = Record<string, MyErrorsOptions>;

export class MyValidators extends Validators {
  static override minLength(minLength: number): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (Validators.minLength(minLength)(control) === null) {
        return null;
      }
      return { minlength: { 'zh-cn': ` ${minLength}`, en: `MinLength is ${minLength}` } };
    };
  }

  static override maxLength(maxLength: number): ValidatorFn {
    return (control: AbstractControl): MyValidationErrors | null => {
      if (Validators.maxLength(maxLength)(control) === null) {
        return null;
      }
      return { maxlength: { 'zh-cn': ` ${maxLength}`, en: `MaxLength is ${maxLength}` } };
    };
  }

}

