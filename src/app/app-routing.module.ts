import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { canActivate } from './app-routes.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./main/main.module').then(m => m.MainModule),
    data: { animation: 'mainPage' },
    canActivate: [canActivate]
  },
  {
    path: 'qa-chatgpt',
    loadChildren: () => import('./qa-chatgpt/qa-chatgpt.module').then(m => m.QAChatGPTModule),
    data: { animation: 'qachatgptPage' },
    canActivate: [canActivate]
  },
  {
    path: 'chatgpt',
    loadChildren: () => import('./chatgpt/chatgpt.module').then(m => m.ChatgptModule),
    data: { animation: 'chatgptPage' },
    canActivate: [canActivate]
  },
  {
    path: 'qa-embedding',
    loadChildren: () => import('./qa-embedding/qa-embedding.module').then(m => m.QaEmbeddingModule),
    data: { animation: 'qaembeddingPage' },
    canActivate: [canActivate]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
    data: { animation: 'loginPage' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
