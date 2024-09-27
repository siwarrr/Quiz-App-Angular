import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { QuizComponent } from './quiz/quiz.component';
import { FormsModule } from '@angular/forms';
import { NzResultModule} from 'ng-zorro-antd/result';

@NgModule({
  declarations: [
    StudentDashboardComponent,
    QuizComponent
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    NzButtonModule,
    NzModalModule,
    NzDropDownModule,
    FormsModule,
    NzResultModule
  ]
})
export class StudentModule { }
