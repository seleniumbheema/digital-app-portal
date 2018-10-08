import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { TestModule } from '../test-helpers';
import { AppReadyEventService } from './components/services/app-ready-event.service';
import { ScriptLoaderService } from './components/services/script-loader.service';
import { CustomerDataService } from './components/services/customer-data.service';
import { AppComponent } from './app.component';
import { LoadingBoxComponent } from './components/view/loading-box/loading-box.component';
import { TimeoutComponent } from './components/view/timeout/timeout.component';

const moduleConfig = {
  imports: [
    TestModule,
  ],
  declarations: [
    AppComponent,
    LoadingBoxComponent,
    TimeoutComponent,
  ],
  providers: [
    AppReadyEventService,
    CustomerDataService,
  ],
};

describe('App Component', () => {

  let fixture: ComponentFixture<AppComponent>;

  it('should call the script loader service', () => {
    const mockWindow = {
      'esure-env': {
        TAG_MANAGER_URL: 'testurl1',
        OPTIMIZELY_URL: 'testurl2',
        LIVECHAT_URL: 'testurl3',
        IOVATION_URL: '',
        RECAPTCHA_SITEKEY: '1234',
      },
    };
    TestBed.configureTestingModule(moduleConfig);
    TestBed.overrideProvider('Window', { useValue: mockWindow });
    fixture = TestBed.createComponent(AppComponent);
    const scriptService = TestBed.get(ScriptLoaderService);
    spyOn(scriptService, 'load').and.returnValue(of({}));
    fixture.detectChanges();
    expect(scriptService.load).toHaveBeenCalledTimes(4);
  });

  it('should not call the script loader service if no src', () => {
    const mockWindow = {
      'esure-env': {
        TAG_MANAGER_URL: '',
        OPTIMIZELY_URL: '',
        LIVECHAT_URL: '',
        IOVATION_URL: '',
        RECAPTCHA_SITEKEY: '',
      },
    };

    TestBed.configureTestingModule(moduleConfig);
    TestBed.overrideProvider('Window', { useValue: mockWindow });
    fixture = TestBed.createComponent(AppComponent);
    const scriptService = TestBed.get(ScriptLoaderService);
    spyOn(scriptService, 'load').and.returnValue(of({}));
    fixture.detectChanges();
    expect(scriptService.load).not.toHaveBeenCalled();
  });
});
