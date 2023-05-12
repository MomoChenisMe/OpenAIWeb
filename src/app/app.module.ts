import { LogoComponent } from './../component/logo/logo.component';
import { environment } from './../environments/environment';
import { NgIconsModule } from '@ng-icons/core';
import { ErrorHandler, inject, NgModule, SecurityContext } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CustomErrorHandler } from 'src/error/custom-error-handler';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { OverlayModule } from '@angular/cdk/overlay';
import { MAT_ICON_LIST } from './ng-icon/material-icons';
import { DialogModule } from 'src/component/dialog/dialog.module';
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { API_CONFIG, HttpInterceptorProvider } from './provider/http.provider';
import { AuthService } from './service/auth.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    OverlayModule,
    DialogModule,
    LogoComponent,
    NgIconsModule.withIcons(MAT_ICON_LIST),
    MarkdownModule.forRoot({
      sanitize: SecurityContext.NONE,
      markedOptions: {
        provide: MarkedOptions,
        useValue: {
          gfm: true,
          breaks: true,
          pedantic: false,
          smartLists: true,
          smartypants: false,
        }
      }
    }),
    SocialLoginModule,
  ],
  providers: [
    // {
    //   provide: ErrorHandler,
    //   useClass: CustomErrorHandler,
    // },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.googleClientId
            )
          },
        ]
      } as SocialAuthServiceConfig,
    },
    {
      provide: API_CONFIG,
      useValue: {
        baseUrl: environment.host,
        tokenWhiteList: /\/Auth\/\w+/
      }
    },
    HttpInterceptorProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
