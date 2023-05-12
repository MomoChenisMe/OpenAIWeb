import { NgIconsModule } from '@ng-icons/core';
import { MarkdownModule } from 'ngx-markdown';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QAChatGPTRoutingModule } from './qa-chatgpt-routing.module';
import { QAChatGPTComponent } from './qa-chatgpt.component';
import { SliderMenuComponent } from 'src/component/slider-menu/slider-menu.component';
import { LogoComponent } from 'src/component/logo/logo.component';
import { UserComponent } from 'src/component/user/user.component';


@NgModule({
  declarations: [
    QAChatGPTComponent
  ],
  imports: [
    CommonModule,
    QAChatGPTRoutingModule,
    ReactiveFormsModule,
    SliderMenuComponent,
    LogoComponent,
    UserComponent,
    NgIconsModule,
    MarkdownModule.forChild()
  ]
})
export class QAChatGPTModule { }
