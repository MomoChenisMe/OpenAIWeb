import { AuthService } from 'src/app/service/auth.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventSourceMessage, EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source';
import { from, Observable, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SilentError } from 'src/error/custom-error-handler';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private ctrl = new AbortController();

  constructor(private http: HttpClient, private authService: AuthService) { }

  public get<T>(url: string, params?: HttpParams, headers?: HttpHeaders): Observable<T> {
    return this.http.get<T>(url, { params, headers });
  }

  public post<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(url, body, { headers });
  }

  public put<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.put<T>(url, body, { headers });
  }

  public patch<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.patch<T>(url, body, { headers });
  }

  public delete<T>(url: string, headers?: HttpHeaders): Observable<T> {
    return this.http.delete<T>(url, { headers });
  }

  public openAIAPIPost(url: string, body?: any): Observable<any> {
    return new Observable(observer => {
      // console.log(body);
      fetchEventSource(environment.host + url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.authService.getAuthToken()
        },
        body: body ? JSON.stringify(body) : null,
        signal: this.ctrl.signal,
        async onopen(response) {
          if (response.ok && response.headers.get('content-type') === EventStreamContentType) {
            return;
          } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
            throw new FatalError();
          } else {
            throw new RetriableError();
          }
        },
        onmessage(msg) {
          // console.log(msg);
          observer.next(JSON.parse(msg.data));
          //message(msg);
          if (msg.event === 'FatalError') {
            throw new FatalError(msg.data);
          }
        },
        onclose() {
          observer.complete();
          console.log('%c Open AI API Close', 'color: red');
        },
        onerror(err) {
          // observer.complete();
          console.log(err);
          // throw new FatalError();
          throw new SilentError('這個錯誤將不會印在控制台');
        },
        openWhenHidden: true
      })
    })
  }
}

class RetriableError extends Error { }
class FatalError extends Error { }


