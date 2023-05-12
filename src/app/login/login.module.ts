import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { LogoComponent } from 'src/component/logo/logo.component';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    LogoComponent,
    GoogleSigninButtonModule
  ]
})
export class LoginModule { }
