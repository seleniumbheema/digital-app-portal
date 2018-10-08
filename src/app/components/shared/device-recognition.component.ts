import { LoadingHandlerComponent } from './loading-handler.component';

/**
 * This is an external function from Iovation for getting the blackbox.
 */
declare const ioGetBlackbox: Function;

interface BlackBoxInfo {
  finished: boolean;
  blackbox: string;
}

/**
 * Any components that need to perform device recogntion should extend this class.
 */
export abstract class DeviceRecognitionComponent extends LoadingHandlerComponent {

  /**
   * Get the device blackbox by calling the Iovation function if it exists.
   * @returns the blackbox if exists, otherwise undefined
   */
  protected getBlackBox(): string {
    let blackbox;
    if (typeof ioGetBlackbox === 'function') {
      const blackboxInfo: BlackBoxInfo = ioGetBlackbox();
      if (blackboxInfo.finished && blackboxInfo.blackbox) {
        blackbox = blackboxInfo.blackbox;
      } else {
        console.debug('Blackbox was not finished so not sending it');
      }
    }
    return blackbox;
  }

}
