import { bootstrapApplication } from '@angular/platform-browser';
import {
  PreloadAllModules,
  provideRouter,
  RouteReuseStrategy,
  withPreloading,
  withRouterConfig,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';

import { isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';
import { type Observable } from 'rxjs';
import { type I18NData } from 'src/app/interfaces';
import { languageData$ } from 'src/app/language';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

export class RXJSLoader implements TranslateLoader {
  getTranslation(): Observable<I18NData> {
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
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withRouterConfig({
        paramsInheritanceStrategy: 'always',
        defaultQueryParamsHandling: 'merge',
      }),
    ),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
});
