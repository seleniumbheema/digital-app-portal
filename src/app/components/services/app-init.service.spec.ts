import { AppInitService } from './app-init.service';

describe('AppInitService', () => {
  let service;

  beforeAll(() => {
    service = new AppInitService();
  });

  it('should create the service', () => {
    expect(service instanceof AppInitService).toBeTrue();
  });

  it('should have an init method', () => {
    expect(typeof service.init === 'function').toBeTrue();
  });

  it('should be able to run the init method', () => {
    expect(service.init()).toBe(undefined);
  });
});
