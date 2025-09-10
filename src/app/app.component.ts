/* eslint-disable @typescript-eslint/no-explicit-any */
import { type AfterViewInit, Component, computed, inject } from '@angular/core';
import {
  IonApp,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonRouterOutlet,
  IonSelect,
  IonSelectOption,
  IonSplitPane,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { linkedQueryParam } from 'ngxtension/linked-query-param';

import { FormsModule } from '@angular/forms';

import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
import { type AppData, type I18NData, type RuleData } from 'src/app/interfaces';
import { languageData$ } from 'src/app/language';

import { sortBy } from 'es-toolkit/compat';
import { navigation$ } from 'src/app/navigation';
import { RulesService } from 'src/app/rules-service';
import * as appData from '../../public/app.json';
import * as i18nData from '../../public/i18n.json';
import * as rulesData from '../../public/rules.json';

const rulesJson: RuleData = (rulesData as any).default;
const appJson: AppData = (appData as any).default;
const i18nJson: I18NData = (i18nData as any).default;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [
    IonApp,
    IonSplitPane,
    IonMenu,
    IonContent,
    IonRouterOutlet,
    IonHeader,
    IonToolbar,
    TranslateModule,
    IonList,
    IonItem,
    IonSelect,
    IonSelectOption,
    FormsModule,
    IonMenuToggle,
  ],
})
export class AppComponent implements AfterViewInit {
  private swUpdate = inject(SwUpdate);
  private translateService = inject(TranslateService);
  public rulesService = inject(RulesService);

  readonly currentGame = linkedQueryParam<string>('game', {
    defaultValue: 'root',
  });

  readonly currentLocale = linkedQueryParam<string>('locale', {
    defaultValue: 'en-US',
  });

  readonly currentVersion = linkedQueryParam<string>('version', {
    defaultValue: '',
  });

  public allGames = computed(() =>
    Object.keys(appJson['games']).map((game) => ({
      code: game,
      name: appJson['games'][game].name,
    })),
  );

  public allLanguages = computed(() =>
    Object.keys(appJson['languages'])
      .map((locale) => ({
        code: locale,
        name: appJson['languages'][locale].name,
      }))
      .filter((lang) =>
        Object.keys(rulesJson[this.currentGame()] || {}).includes(lang.code),
      ),
  );

  public allVersions = computed(() =>
    sortBy(
      Object.keys(rulesJson[this.currentGame()][this.currentLocale()] ?? {}),
      (k) => +k.replace('v', ''),
    ).reverse(),
  );

  constructor() {
    this.initializeApp();
  }

  initializeApp() {
    this.watchAppChanges();
  }

  private watchAppChanges() {
    if (!this.swUpdate.isEnabled) {
      return;
    }

    interval(1000 * 60 * 15).subscribe(() => this.swUpdate.checkForUpdate());
    this.swUpdate.checkForUpdate();
  }

  ngAfterViewInit() {
    if (!this.currentVersion()) {
      this.currentVersion.set(this.allVersions()[0]);
    }

    this.updateRules();
  }

  public changeGame() {
    this.currentLocale.set(this.allLanguages()[0]?.code || 'en-US');
    this.currentVersion.set(this.allVersions()[0]);
    this.updateRules();
  }

  public changeLanguage() {
    this.updateRules();
  }

  public updateRules() {
    this.translateService.use(this.currentLocale());
    languageData$.next(i18nJson[this.currentGame()][this.currentLocale()]);

    console.log(rulesJson, this.currentVersion());

    this.rulesService.setRules(
      rulesJson[this.currentGame()][this.currentLocale()][
        this.currentVersion()
      ],
    );
  }

  public navigateTo(id: string) {
    navigation$.next(id);
  }
}
