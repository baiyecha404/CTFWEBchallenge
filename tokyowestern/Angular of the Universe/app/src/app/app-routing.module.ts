import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { QuestionComponent } from './question/question.component';
import { AnswerComponent } from './answer/answer.component';

const routes: Routes = [
  { path: '', redirectTo: '/q', pathMatch: 'full' },
  { path: 'q', component: QuestionComponent },
  { path: 'a', component: AnswerComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
