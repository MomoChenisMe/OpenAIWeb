import { AuthService } from 'src/app/service/auth.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../provider/http.provider';
import { ApiConfigModel } from '../model/http';

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptService implements HttpInterceptor {
  private apiConfig: ApiConfigModel;

  constructor(private authService: AuthService, @Inject(API_CONFIG) apiConfig: ApiConfigModel) {
    this.apiConfig = apiConfig;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.noTokenWhiteList(req.url)) {
      req = req.clone({
        url: `${this.apiConfig.baseUrl}${req.url}`
      });
      return next.handle(req);
    } else {
      req = req.clone({
        setHeaders: { authorization: 'Bearer ' + this.authService.getAuthToken() },
        url: `${this.apiConfig.baseUrl}${req.url}`
      });
      return next.handle(req);
    }
  }

  private noTokenWhiteList(url: string) {
    if (url.match(this.apiConfig.tokenWhiteList)) {
      return true;
    }
    return false;
  }
}
