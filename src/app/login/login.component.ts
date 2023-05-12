import { HttpService } from './../service/http.service';
import { BehaviorSubject, delay, from, map, of, switchMap, tap } from 'rxjs';
import { AuthService } from './../service/auth.service';
import { GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, ElementRef, OnInit, Renderer2, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { OpenAITokenModel } from '../model/auth';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('googleLoginDiv') googleLoginDiv!: ElementRef<HTMLElement>;

  private googleSocialAuthLogin$ = this.socialAuthService.authState.pipe(
    tap(() => this.loadingSubject$.next(true)),
    switchMap(socialUser => {
      if (socialUser) {
        return this.httpService.get<OpenAITokenModel>(`/Auth/GoogleOneTapSignIn/${socialUser.idToken}`).pipe(
          map(result => {
            if (result.token !== '') {
              this.authService.setAuthToken(result.token);
              return true;
            } else {
              return false;
            }
          }),
          delay(1000)
        );
      }
      return of(false);
    }),
    tap(loginResult => {
      this.loadingSubject$.next(false);
    }),
    switchMap(loginResult => {
      if (loginResult) {
        return from(this.router.navigateByUrl('/'))
      }
      return of(null);
    })
  );

  private loadingSubject$ = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject$.asObservable();

  constructor(private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private httpService: HttpService,
    private socialAuthService: SocialAuthService,
    private elRef: ElementRef,
    private renderer2: Renderer2) {
  }

  ngOnInit(): void {
    this.googleSocialAuthLogin$.subscribe();
  }

  ngOnDestroy(): void {
  }

}
