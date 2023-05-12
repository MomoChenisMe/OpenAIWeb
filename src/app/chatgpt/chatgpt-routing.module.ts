import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatgptComponent } from './chatgpt.component';

const routes: Routes = [{ path: '', component: ChatgptComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatgptRoutingModule { }
