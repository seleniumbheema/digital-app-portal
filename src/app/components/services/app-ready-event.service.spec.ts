import { AppReadyEventService } from './app-ready-event.service';

describe('AppReadyEventService', () => {

  class MockDocument {
    public dispatchEvent(): void {
    }
  }

  let appReadyEventService: AppReadyEventService;
  let mockDocument: MockDocument;

  beforeEach(() => {
    mockDocument = new MockDocument();
    appReadyEventService = new AppReadyEventService(mockDocument);
  });

  it('should only dispatch one event if called twice', () => {
    spyOn(mockDocument, 'dispatchEvent');
    appReadyEventService.trigger();
    appReadyEventService.trigger();
    expect(mockDocument.dispatchEvent).toHaveBeenCalledTimes(1);
  });
});
