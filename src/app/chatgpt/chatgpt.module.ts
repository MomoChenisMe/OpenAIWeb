import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatgptRoutingModule } from './chatgpt-routing.module';
import { ChatgptComponent } from './chatgpt.component';
import { LogoComponent } from 'src/component/logo/logo.component';
import { SliderMenuComponent } from 'src/component/slider-menu/slider-menu.component';
import { MarkdownModule } from 'ngx-markdown';
import { NgIconsModule } from '@ng-icons/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatroomButtonComponent } from './chatroom-button/chatroom-button.component';
import { UserComponent } from 'src/component/user/user.component';


@NgModule({
  declarations: [
    ChatgptComponent,
    ChatroomButtonComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChatgptRoutingModule,
    SliderMenuComponent,
    LogoComponent,
    UserComponent,
    NgIconsModule,
    MarkdownModule.forChild()
  ]
})
export class ChatgptModule { }
