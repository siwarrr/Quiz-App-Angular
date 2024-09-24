import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { QuizComponent } from './quiz/quiz.component';

const routes: Routes = [
  {path: '', component: StudentDashboardComponent},
  {path: 'quiz/:quizId', component: QuizComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
