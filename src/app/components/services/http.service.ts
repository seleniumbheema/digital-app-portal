import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Http service, used for making Http requests. Interceptors can modify the requests/responses.
 * We have our own one, HttpModifyInterceptor, and also a third party one, provided by the use of
 * including JwtModule in the main app. This JwtModule is responsible for sending the Authorisation
 * header with the Bearer and JWT token.
 */
@Injectable()
export class HttpService {

  /**
   * Constructor that injects in the HttpClient required for making Http requests.
   * @param {HttpClient} http built in angular http module
   */
  constructor(private http: HttpClient) {
  }

  public get<T>(url: string): Observable<T | HttpErrorModel> {
    return this.http.get<T>(`${window['esure-env'].XAPI_URL}${url}`, { withCredentials: true }).pipe(
      catchError(this.handleError));
  }

  /**
   * Used for getting binary data like a PDF document, the full response is returned so that the information in the headers can be used.
   * The response body is expected to be a Blob type.
   * @param {string} url
   * @returns {(Observable<HttpResponse<Blob> | HttpErrorModel>)}
   * @memberof HttpService
   */
  public getBinary(url: string): Observable<HttpResponse<Blob> | HttpErrorModel> {
    return this.http.get(`${window['esure-env'].XAPI_URL}${url}`, { withCredentials: true, responseType: 'blob', observe: 'response' }).pipe(
      catchError(this.handleError));
  }

  public post<T>(url: string, body: object): Observable<T | HttpErrorModel> {
    return this.http.post<T>(`${window['esure-env'].XAPI_URL}${url}`, body, { withCredentials: true }).pipe(
      catchError(this.handleError));
  }

  /**
   * Handles any http errors.
   * @param  {HttpErrorResponse} err: the error
   * @return {Observable<HttpErrorModel>} an observable error containing json conforming to HttpErrorModel interface
   */
  /* istanbul ignore next */
  private handleError(err: HttpErrorResponse): Observable<HttpErrorModel> {
    // console.debug('HttpErrorResponse is:', err);
    let errMsg: string;
    let returnObject: HttpErrorModel;
    if (err.error instanceof Error) {
      // console.debug('Error was instance of Error, meaning client side or network error', err);
      errMsg = err.error.message ? err.error.message : err.error.toString();
      returnObject = {
        errMsg,
        body: err.error,
        statusCode: err.status,
        statusText: err.statusText,
      };
    } else {
      // console.debug('Error was an actual error from the backend');
      const body = err.error;
      const errText = JSON.stringify(body);
      errMsg = `${err.status} - ${err.statusText} ${errText}`;
      returnObject = {
        errMsg,
        body,
        statusCode: err.status,
        statusText: err.statusText,
      };
    }
    return throwError(returnObject);
  }
}

/**
 * Interface to describe the object that will be returned when an error occurs during any HTTP calls.
 */
export interface HttpErrorModel {
  errMsg: string;
  body: string | object;
  statusCode: number | string;
  statusText: string;
}
