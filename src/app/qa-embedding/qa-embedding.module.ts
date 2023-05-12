import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SliderMenuComponent } from './../../component/slider-menu/slider-menu.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QaEmbeddingRoutingModule } from './qa-embedding-routing.module';
import { QaEmbeddingComponent } from './qa-embedding.component';
import { LogoComponent } from 'src/component/logo/logo.component';
import { AiRobotComponent } from 'src/component/ai-robot/ai-robot.component';
import { UserComponent } from 'src/component/user/user.component';
import { FolderlistComponent } from './folderlist/folderlist.component';
import { NgIconsModule } from '@ng-icons/core';
import { PopovermenuService } from './popovermenu/popovermenu.service';
import { PopovermenuComponent } from './popovermenu/popovermenu.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  declarations: [
    QaEmbeddingComponent,
    FolderlistComponent,
    PopovermenuComponent
  ],
  imports: [
    CommonModule,
    QaEmbeddingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SliderMenuComponent,
    LogoComponent,
    UserComponent,
    AiRobotComponent,
    NgIconsModule,
    CKEditorModule
  ],
  providers: [
    PopovermenuService
  ]
})
export class QaEmbeddingModule { }
