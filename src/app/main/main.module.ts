import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { LogoComponent } from 'src/component/logo/logo.component';
import { UserComponent } from 'src/component/user/user.component';
import { NgIconsModule } from '@ng-icons/core';



@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    LogoComponent,
    UserComponent,
    NgIconsModule
  ]
})
export class MainModule { }
