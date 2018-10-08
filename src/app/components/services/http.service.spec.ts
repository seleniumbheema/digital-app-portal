import { HttpClient, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { HttpService } from './http.service';

describe('HttpService', () => {

  let httpService: HttpService;
  let httpClient: HttpClient;

  beforeAll(() => {
    httpClient = new HttpClient(null);
    httpService = new HttpService(httpClient);
  });

  it('should create the service', () => {
    expect(httpService instanceof HttpService).toBeTrue();
  });

  it('should get', () => {
    const returnVal = 'OK';
    spyOn(httpClient, 'get').and.returnValue(of(returnVal));
    const get = httpService.get('url');
    get.subscribe(
      (data) => {
        expect(data).toEqual(returnVal);
      },
      () => {
        fail('Not expected to fail');
      });
  });

  it('should getBinary', () => {
    const returnVal = new HttpResponse({ body: new Blob() });
    spyOn(httpClient, 'get').and.returnValue(of(returnVal));
    const get = httpService.getBinary('url');
    get.subscribe(
      (data) => {
        expect(data).toEqual(returnVal);
      },
      () => {
        fail('Not expected to fail');
      });
  });

  it('should post', () => {
    const returnVal = 'OK';
    spyOn(httpClient, 'post').and.returnValue(of(returnVal));
    const post = httpService.post('url', {});
    post.subscribe(
      (data) => {
        expect(data).toEqual(returnVal);
      },
      () => {
        fail('Not expected to fail');
      });
  });
});
