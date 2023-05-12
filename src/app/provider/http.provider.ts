import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { InjectionToken } from "@angular/core";
import { ApiConfigModel } from "../model/http";
import { HttpInterceptService } from "../service/http.intercept.service";

export const HttpInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: HttpInterceptService,
  multi: true
};

export const API_CONFIG = new InjectionToken<ApiConfigModel>('apiConfig');
