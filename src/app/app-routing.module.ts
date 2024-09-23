import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [

  { path: '', redirectTo: 'welcome', pathMatch: 'full' }, // Redirection vers le module Welcome
  { path: 'welcome', loadChildren: () => import('./welcome/welcome.module').then(m => m.WelcomeModule) },
  { path: 'instructor', loadChildren: () => import('./instructor/instructor.module').then(m => m.InstructorModule)},
  { path: 'student', loadChildren: () => import('./student/student.module').then(m => m.StudentModule)},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
