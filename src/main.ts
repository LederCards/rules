import { bootstrapApplication } from '@angular/platform-browser';
import {
  PreloadAllModules,
  provideRouter,
  RouteReuseStrategy,
  withPreloading,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';

import { isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';
import { Observable } from 'rxjs';
import { languageData$ } from 'src/app/language';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

export class RXJSLoader implements TranslateLoader {
  getTranslation(): Observable<any> {
    return languageData$.asObservable();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideTranslateService({
      fallbackLang: 'en',
      lang: 'en',
      loader: {
        provide: TranslateLoader,
        useClass: RXJSLoader,
      },
    }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
});
