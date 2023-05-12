import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QAChatGPTComponent } from './qa-chatgpt.component';

const routes: Routes = [{ path: '', component: QAChatGPTComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QAChatGPTRoutingModule { }
