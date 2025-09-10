/* eslint-disable @typescript-eslint/no-explicit-any */
import { computed, inject, Injectable } from '@angular/core';
import { linkedQueryParam } from 'ngxtension/linked-query-param';

import { sortBy } from 'es-toolkit/compat';
import { type AppData, type I18NData, type RuleData } from 'src/app/interfaces';

import { TranslateService } from '@ngx-translate/core';
import { languageData$ } from 'src/app/language';
import { RulesService } from 'src/app/rules-service';
import * as appData from '../../public/app.json';
import * as i18nData from '../../public/i18n.json';
import * as rulesData from '../../public/rules.json';

const appJson: AppData = (appData as any).default;
const rulesJson: RuleData = (rulesData as any).default;
const i18nJson: I18NData = (i18nData as any).default;

@Injectable({
  providedIn: 'root',
})
export class ParamService {
  private translateService = inject(TranslateService);
  private rulesService = inject(RulesService);

  public get appJson() {
    return appJson;
  }

  public get i18nJson() {
    return i18nJson;
  }

  public get rulesJson() {
    return rulesJson;
  }

  readonly currentGame = linkedQueryParam<string>('game', {
    defaultValue: '',
  });

  readonly currentLocale = linkedQueryParam<string>('locale', {
    defaultValue: '',
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

  init() {
    if (!this.currentGame()) {
      this.currentGame.set('root');
    }

    if (!this.currentLocale()) {
      this.currentLocale.set('en-US');
    }

    if (!this.currentVersion()) {
      this.currentVersion.set(this.allVersions()[0]);
    }

    this.updateRules();
  }

  public changeGame() {
    if (
      !this.allLanguages()
        .map((l) => l.code)
        .includes(this.currentLocale())
    ) {
      this.currentLocale.set('en-US');
    }

    this.currentVersion.set(this.allVersions()[0]);
    this.updateRules();
  }

  public changeLanguage() {
    this.updateRules();
  }

  public updateRules() {
    this.translateService.use(this.currentLocale());
    languageData$.next(i18nJson[this.currentGame()][this.currentLocale()]);

    this.rulesService.setRules(
      rulesJson[this.currentGame()][this.currentLocale()][
        this.currentVersion()
      ],
    );
  }
}
