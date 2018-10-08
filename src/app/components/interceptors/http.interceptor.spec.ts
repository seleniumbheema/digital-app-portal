import { HttpRequest, HttpXhrBackend } from '@angular/common/http';

import { HttpModifyInterceptor } from './http.interceptor';
import { Injector } from '@angular/core';
import { AuthService } from '../auth/auth.service';

describe('HttpModifyInterceptor', () => {

  let httpModifyInterceptor: HttpModifyInterceptor;
  let injector: Injector;
  let authService: AuthService;

  beforeEach(() => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['getAccessToken']);
    injector = jasmine.createSpyObj<Injector>('Injector', { get: authService });
    httpModifyInterceptor = new HttpModifyInterceptor(injector);
  });

  it('should create an instance', () => {
    expect(httpModifyInterceptor).toBeTruthy();
  });

  it('should add headers', () => {
    const req = new HttpRequest('GET', 'url');
    const handler = new HttpXhrBackend(null);
    httpModifyInterceptor.intercept(req, handler);
    expect(injector.get).toHaveBeenCalled();
    expect(authService.getAccessToken).toHaveBeenCalled();
  });

});
