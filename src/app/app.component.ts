/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, type OnInit } from '@angular/core';
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
import { TranslateModule } from '@ngx-translate/core';

import { FormsModule } from '@angular/forms';

import { SwUpdate } from '@angular/service-worker';
import { interval } from 'rxjs';
import { type GameRule } from 'src/app/interfaces';

import { navigation$ } from 'src/app/navigation';
import { ParamService } from 'src/app/param-service';
import { RulesService } from 'src/app/rules-service';

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
export class AppComponent implements OnInit {
  private swUpdate = inject(SwUpdate);
  public paramService = inject(ParamService);
  public rulesService = inject(RulesService);

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

  public navigateTo(rule: GameRule) {
    navigation$.next(rule.index);
  }

  ngOnInit() {
    // mega whatever, this is stupid
    const baseParams = new URLSearchParams(window.location.search);

    if (baseParams.has('product'))
      this.paramService.currentProduct.set(baseParams.get('product')!);
    if (baseParams.has('locale'))
      this.paramService.currentLocale.set(baseParams.get('locale')!);
    if (baseParams.has('printing'))
      this.paramService.currentPrinting.set(baseParams.get('printing')!);
    if (baseParams.has('compareToPrinting'))
      this.paramService.compareToPrinting.set(
        baseParams.get('compareToPrinting')!,
      );

    this.paramService.init();

    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        navigation$.next(hash);
      }, 1500);
    }
  }
}
