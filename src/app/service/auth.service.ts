import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { TokenPayloadModel } from '../model/auth';


const AUTHTOKENKEY = 'ChatGPTAIAuthToken';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenPayloadInfo: TokenPayloadModel | undefined;

  constructor() {
    let token = window.localStorage.getItem(AUTHTOKENKEY);
    this.decodeJWT();
  }

  get tokenInfo(): TokenPayloadModel | undefined {
    return this.tokenPayloadInfo;
  }

  public hasAuthToken(): boolean {
    let token = window.localStorage.getItem(AUTHTOKENKEY);
    return token ? true : false;
  }

  public setAuthToken(token: string) {
    window.localStorage.setItem(AUTHTOKENKEY, token);
    this.decodeJWT();
  }

  public getAuthToken() {
    let token = window.localStorage.getItem(AUTHTOKENKEY);
    return token ? token : '';
  }

  public clearAuthToken() {
    window.localStorage.removeItem(AUTHTOKENKEY);
  }

  public decodeJWT() {
    let token = window.localStorage.getItem(AUTHTOKENKEY);
    this.tokenPayloadInfo = token ? jwtDecode<TokenPayloadModel>(token) : undefined;
  }
}
