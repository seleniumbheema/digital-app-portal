import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { Idle } from '@ng-idle/core';
import * as moment from 'moment';

import { CustomerDataService } from '../services/customer-data.service';
import { HttpService, HttpErrorModel } from '../services/http.service';
import * as AUTH_INTERFACES from './auth.interface';
import {
  JWT_STATE_TOKEN_NAME, JWT_MASTER_ID_PROPERTY_NAME, SESSION_TIMEOUT_WARNING_SECONDS,
  CUSTOMER_STATUS_LOCAL_STORAGE_KEY_NAME, JWT_ACCESS_TOKEN_NAME, JWT_REFRESH_TOKEN_NAME,
} from './auth.module';
import { RegisterAccountResponse } from '../../models/register-account-response';

@Injectable()
export class AuthService {

  constructor(
    private httpService: HttpService,
    private jwtHelperService: JwtHelperService,
    private router: Router,
    private customerDataService: CustomerDataService,
    private idle: Idle,
  ) { }

  /* istanbul ignore next */
  public authenticate(credentials: AUTH_INTERFACES.LoginCredentials): Observable<object> {
    return this.httpService.post<object>('/login', credentials);
  }

  /* istanbul ignore next */
  public getToken(): Observable<object> {
    return this.httpService.get<object>('/token');
  }

  /* istanbul ignore next */
  public refreshToken(): Observable<object> {
    return this.httpService.get<object>('/token/refresh');
  }

  /**
   * Gets the decrypted username passed back inside the JWT.
   *
   * @param {string} token
   * @returns {Observable<object>}
   * @memberof AuthService
   */
  /* istanbul ignore next */
  public getUsernameFromToken(token: string): Observable<object> {
    return this.httpService.post<object>('/login/forgot-password/token', { token });
  }

  /* istanbul ignore next */
  public confirmChallenge(credentials: AUTH_INTERFACES.NewPasswordCredentials): Observable<object> {
    return this.httpService.post<object>('/login/confirm', credentials);
  }

  /* istanbul ignore next */
  public getUsernameFromCustomerDetails(userDetails: AUTH_INTERFACES.UserNameRetrievalDetails): Promise<string> {
    return new Promise((resolve, reject) => {
      this.httpService.post('/account/find-email', userDetails).subscribe(
        (data: any) => {
          resolve(data.email);
        },
        () => reject(),
      );
    });
  }

  /* istanbul ignore next */
  public resetPassword(userName: string, recaptchaCode: string): Observable<object> {
    return this.httpService.post<object>('/login/forgot-password', { userName, recaptchaCode });
  }

  /* istanbul ignore next */
  public confirmResetPassword(credentials: AUTH_INTERFACES.PasswordResetConfirmationDetails): Observable<object> {
    return this.httpService.post<object>('/login/forgot-password/confirm', credentials);
  }

  /* istanbul ignore next */
  public findMasterCust(credentials: AUTH_INTERFACES.MasterCustomerCredentials, recaptchaCode: string):
    Observable<RegisterAccountResponse | HttpErrorModel> {
    return this.httpService.post<RegisterAccountResponse>('/register', { ...credentials, recaptchaCode });
  }

  /**
   * Determines if the user is logged in, by checking existence of the JWT and that the token is not expired and contains a 'mid' property.
   * @return {boolean} true if the user is logged in, false otherwise
   */
  public isUserLoggedIn(): boolean {
    return this.tokenHasKey(JWT_MASTER_ID_PROPERTY_NAME);
  }

  /**
   * Checks if the specified key exists in the JWT.
   * @param key the key
   * @returns {boolean} true if the key exists
   */
  public tokenHasKey(key: string): boolean {
    const validToken = this.isValidToken();
    let hasKey: boolean = false;
    if (validToken) {
      const decoded = this.decodeToken();
      hasKey = decoded[key] !== undefined;
    }
    return hasKey;
  }

  /**
   * Gets the value of the specified key from the JWT.
   * @param key the key
   * @returns the value of the key
   */
  public getKeyFromToken(key: string): any {
    const validToken = this.isValidToken();
    let val: string;
    if (validToken) {
      const decoded = this.decodeToken();
      val = decoded[key];
    }
    return val;
  }

  /**
   * Decodes the JWT.
   * @returns the decoded JWT
   */
  public decodeToken(): any {
    return this.jwtHelperService.decodeToken();
  }

  /**
   * Get the JWT expiration date.
   * @returns {Date|null} the expiration date or null if token does not exist
   */
  public getTokenExpirationDate(): Date | null {
    const token = this.getJwtToken();
    let returnDate = null;
    if (token) {
      try {
        returnDate = this.jwtHelperService.getTokenExpirationDate(token);
      } catch (error) {
        console.debug('Caught error getting JWT expiration date, redirecting to 500 page', error);
        this.redirectTo500Page(error, 'error getting JWT expiration date');
      }
    }
    return returnDate;
  }

  /**
   * Handles the logout of a user.
   * @param redirectToLogout {boolean} whether to redirect to logout page once logged out
   */
  public logout(redirectToLogout: boolean): void {
    this.removeJWT();
    localStorage.removeItem(CUSTOMER_STATUS_LOCAL_STORAGE_KEY_NAME);
    this.removeAccessToken();
    this.removeRefreshToken();
    this.customerDataService.customer = null;

    /* istanbul ignore next */
    if (redirectToLogout) {
      this.router.navigateByUrl('/auth/logout');
    }
  }

  /**
   * Sets the JWT.
   * @param token the JWT
   */
  public setJwtToken(token: string): void {
    localStorage.setItem(JWT_STATE_TOKEN_NAME, token);

    const jwtExpiry = this.getTokenExpirationDate();
    // Stop the idle
    this.idle.stop();
    // Set the time

    const expiry = moment(jwtExpiry);
    const now = moment();
    const diffSeconds = expiry.diff(now, 'seconds');
    console.debug('IDLE: Seconds until expiry of JWT is', diffSeconds);

    // Take off 2 seconds at the end to avoid the chance that someone hits continue session at exact point token becomes expired
    let idleSeconds = diffSeconds - SESSION_TIMEOUT_WARNING_SECONDS - 2;
    /* istanbul ignore next */
    let timeoutSeconds = diffSeconds < SESSION_TIMEOUT_WARNING_SECONDS ? diffSeconds : SESSION_TIMEOUT_WARNING_SECONDS;

    // Can't be less than or equal to zero, so set to 1 if it is
    /* istanbul ignore next */
    if (idleSeconds <= 0) {
      idleSeconds = 1;
      // If we set idle to 1, then minus one from timeout, only if greater than 1 as can't set timoeout to zero
      if (timeoutSeconds > 1) {
        timeoutSeconds -= 1;
      }
    }

    this.idle.setIdle(idleSeconds);
    this.idle.setTimeout(timeoutSeconds);

    console.debug('IDLE: Reset idle seconds to', this.idle.getIdle());
    console.debug('IDLE: Reset idle timeout seconds to', this.idle.getTimeout());

    this.idle.watch();
  }

  public setAccessToken(token: string): void {
    localStorage.setItem(JWT_ACCESS_TOKEN_NAME, token);
  }

  public getAccessToken(): string {
    return localStorage.getItem(JWT_ACCESS_TOKEN_NAME);
  }

  private removeAccessToken(): void {
    localStorage.removeItem(JWT_ACCESS_TOKEN_NAME);
  }

  public setRefreshToken(token: string): void {
    localStorage.setItem(JWT_REFRESH_TOKEN_NAME, token);
  }

  public getRefreshToken(): string {
    return localStorage.getItem(JWT_REFRESH_TOKEN_NAME);
  }

  private removeRefreshToken(): void {
    localStorage.removeItem(JWT_REFRESH_TOKEN_NAME);
  }

  public getJwtToken(): string {
    return this.jwtHelperService.tokenGetter();
  }

  private removeJWT() {
    localStorage.removeItem(JWT_STATE_TOKEN_NAME);
  }

  /**
   * Determines if a token is valid, it must both exist and not be expired to be valid.
   * @returns boolean
   */
  public isValidToken(): boolean {
    const tokenExists = this.getJwtToken();
    return tokenExists ? !this.isTokenExpired(tokenExists) : false;
  }

  /**
   * Checks if the JWT is expired
   * @param token JWT
   * @returns {boolean} true if the token is expired
   */
  private isTokenExpired(token: string): boolean {
    let expired = true;
    try {
      expired = this.jwtHelperService.isTokenExpired(token);
    } catch (error) {
      console.debug('Caught error determining JWT expiration, redirecting to 500 page', error);
      this.redirectTo500Page(error, 'error determining JWT expiration');
    }
    return expired;
  }

  /**
   * Redirects to the 500 error page.
   */
  private redirectTo500Page(error: any, extraInfo: string): Promise<boolean> {
    this.customerDataService.setLastError(error, extraInfo);
    return this.router.navigateByUrl('/error/500');
  }

}
