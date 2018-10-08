import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

// Enable prod mode for a prod build
if (process.env.NODE_ENV === 'production') {
  enableProdMode();
}

export function main(): Promise<any> {
  return platformBrowserDynamic().bootstrapModule(AppModule)
    .catch((err: any) => console.error(err));
}

/**
 * Needed for hmr
 * in prod this is replace for document ready
 */
switch (document.readyState) {
  case 'loading':
    document.addEventListener('DOMContentLoaded', domReadyHandler, false);
    break;
  case 'interactive':
  case 'complete':
  default:
    main();
}

function domReadyHandler() {
  document.removeEventListener('DOMContentLoaded', domReadyHandler, false);
  main();
}
