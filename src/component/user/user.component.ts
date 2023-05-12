import { from, switchMap } from 'rxjs';
import { AuthService } from './../../app/service/auth.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgIconsModule } from '@ng-icons/core';
import { TokenPayloadModel } from 'src/app/model/auth';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgIconsModule
  ],
  animations: [
    trigger('userPopoverAnimation', [
      state('void', style({
        opacity: 0,
        transform: 'scale(0.8)',
      })),
      state('*', style({
        opacity: 1,
        transform: 'scale(1)',
      })),
      transition('void => *', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('0.2s ease-in-out')
      ]),
      transition('* => void', [
        animate('0.2s ease-in-out')
      ])
    ])
  ]
})
export class UserComponent implements OnInit {
  showPopover = false;
  constructor(private authService: AuthService, private router: Router) { }

  get tokenInfo(): TokenPayloadModel | undefined {
    return this.authService.tokenInfo;
  }

  ngOnInit(): void {

  }

  onOpenUserInfo() {
    this.showPopover = !this.showPopover;
  }

  onLogoutClick() {
    this.authService.clearAuthToken();
    this.router.navigateByUrl('login');
  }
}

