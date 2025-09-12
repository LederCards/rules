/* eslint-disable @typescript-eslint/no-explicit-any */
import { computed, inject, Injectable } from '@angular/core';
import { linkedQueryParam } from 'ngxtension/linked-query-param';

import { sortBy } from 'es-toolkit/compat';
import {
  type AppData,
  type ErrataData,
  type I18NData,
  type RuleData,
} from 'src/app/interfaces';

import { TranslateService } from '@ngx-translate/core';
import { injectLocalStorage } from 'ngxtension/inject-local-storage';
import { languageData$ } from 'src/app/language';
import { RulesService } from 'src/app/rules-service';
import * as appData from '../../public/app.json';
import * as errataData from '../../public/errata.json';
import * as i18nData from '../../public/i18n.json';
import * as rulesData from '../../public/rules.json';

const appJson: AppData = (appData as any).default;
const rulesJson: RuleData = (rulesData as any).default;
const i18nJson: I18NData = (i18nData as any).default;
const errataJson: ErrataData = (errataData as any).default;

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

  public get erratasJson() {
    return errataJson;
  }

  readonly currentProduct = linkedQueryParam<string>('product', {
    defaultValue: '',
  });

  readonly currentLocale = linkedQueryParam<string>('locale', {
    defaultValue: '',
  });

  readonly currentVersion = linkedQueryParam<string>('version', {
    defaultValue: '',
  });

  public showFAQ = injectLocalStorage<boolean>('showFAQ', {
    defaultValue: false,
  });

  public showErrata = injectLocalStorage<boolean>('showErrata', {
    defaultValue: false,
  });

  public allProducts = computed(() =>
    Object.keys(appJson['products']).map((game) => ({
      code: game,
      name: appJson['products'][game].name,
    })),
  );

  public allLanguages = computed(() =>
    Object.keys(appJson['languages'])
      .map((locale) => ({
        code: locale,
        name: appJson['languages'][locale].name,
      }))
      .filter((lang) =>
        Object.keys(rulesJson[this.currentProduct()] || {}).includes(lang.code),
      ),
  );

  public allVersions = computed(() =>
    sortBy(
      Object.keys(rulesJson[this.currentProduct()][this.currentLocale()] ?? {}),
      (k) => +k.replace('v', ''),
    ).reverse(),
  );

  public currentErrata = computed(
    () => this.erratasJson[this.currentProduct()]?.[this.currentLocale()] ?? [],
  );

  init() {
    if (!this.currentProduct()) {
      this.currentProduct.set('root');
    }

    if (!this.currentLocale()) {
      this.currentLocale.set('en-US');
    }

    if (!this.currentVersion()) {
      this.currentVersion.set(this.allVersions()[0]);
    }

    this.updateRules();
  }

  public changeProduct() {
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
    languageData$.next(i18nJson[this.currentProduct()][this.currentLocale()]);

    this.rulesService.setRules(
      rulesJson[this.currentProduct()][this.currentLocale()][
        this.currentVersion()
      ],
    );
  }
}
