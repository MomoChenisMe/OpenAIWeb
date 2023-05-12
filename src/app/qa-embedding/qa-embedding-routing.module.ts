import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QaEmbeddingComponent } from './qa-embedding.component';

const routes: Routes = [{ path: '', component: QaEmbeddingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QaEmbeddingRoutingModule { }
