import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Injectable()
export class ScriptLoaderService {
  private scripts: ScriptModel[] = [];

  public load(script: ScriptModel): Observable<ScriptModel> {
    return new Observable<ScriptModel>((observer: Observer<ScriptModel>) => {
      const existingScript = this.scripts.find(s => s.name === script.name);

      // Complete if already loaded
      if (existingScript && existingScript.loaded) {
        observer.next(existingScript);
        observer.complete();
      } else {
        // Add the script
        this.scripts = [...this.scripts, script];

        // Load the script
        const scriptElement = document.createElement('script');
        scriptElement.type = 'text/javascript';
        scriptElement.src = script.src;
        if (script.id) {
          scriptElement.id = script.id;
        }

        // Can only have async or defer, never both
        if (script.async) {
          scriptElement.async = true;
        } else if (script.defer) {
          scriptElement.defer = true;
        }

        scriptElement.onload = () => {
          script.loaded = true;
          observer.next(script);
          observer.complete();
        };

        scriptElement.onerror = (error: any) => {
          observer.error(`Couldn't load script ${script.src} - Error is: ${error}`);
        };

        document.getElementsByTagName('head')[0].appendChild(scriptElement);
      }
    });
  }
}

export interface ScriptModel {
  name: string;
  src: string;
  loaded: boolean;
  id?: string;
  async?: boolean;
  defer?: boolean;
}
