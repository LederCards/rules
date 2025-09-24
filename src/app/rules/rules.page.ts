import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonMenuButton,
  IonModal,
  IonPopover,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import {
  close,
  helpCircle,
  language,
  link,
  logoDiscord,
  logoGithub,
  options,
  returnUpBack,
  search,
} from 'ionicons/icons';
import { linkedQueryParam } from 'ngxtension/linked-query-param';
import { navigation$ } from 'src/app/navigation';
import { ParamService } from 'src/app/param-service';
import { RulesService } from 'src/app/rules-service';
import { CompareRulesComponent } from '../compare-rules/compare-rules.component';
import { RulesDisplayComponent } from '../rules-display/rules-display.component';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.page.html',
  styleUrls: ['./rules.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonFab,
    IonFabButton,
    IonIcon,
    IonButtons,
    IonMenuButton,
    IonButton,
    TranslateModule,
    IonSearchbar,
    RulesDisplayComponent,
    CompareRulesComponent,
    IonSelect,
    IonSelectOption,
    IonPopover,
    IonList,
    IonItem,
    IonCheckbox,
    IonModal,
  ],
})
export class RulesPage {
  public paramService = inject(ParamService);
  public rulesService = inject(RulesService);

  readonly search = linkedQueryParam('search', {
    defaultValue: '',
  });

  public showSearch = signal<boolean>(false);
  public scrollBackTo = signal<string>('');

  public shouldCompareRulesInstead = computed(
    () => !!this.paramService.compareToPrinting(),
  );

  @HostListener('document:click', ['$event'])
  public clickScreen($event: PointerEvent) {
    let realTarget = $event.target;
    if ((realTarget as HTMLElement).tagName === 'P') {
      realTarget = (realTarget as HTMLElement).parentElement as Element;
    }

    const hash = (realTarget as HTMLAnchorElement).hash;
    if (!realTarget || !hash) {
      return;
    }

    $event.preventDefault();
    $event.stopPropagation();

    const target = realTarget as HTMLElement;
    if (target && target.classList.contains('rule-link')) {
      const closestIndexLink = target
        .closest('.rule-container')
        ?.querySelector('.index-link')
        ?.getAttribute('id');

      if (closestIndexLink) {
        this.scrollBackTo.set('#' + closestIndexLink);
      }
    }

    this.scrollToEl(hash, 'start');
  }

  resetScrollbackButton() {
    this.scrollBackTo.set('');
  }

  constructor() {
    addIcons({
      returnUpBack,
      helpCircle,
      close,
      logoGithub,
      logoDiscord,
      link,
      search,
      language,
      options,
    });

    navigation$
      .pipe(takeUntilDestroyed())
      .subscribe((id) => this.scrollToEl(id, 'start'));
  }

  public scrollToEl(id: string, block: ScrollLogicalPosition = 'start') {
    if (id.startsWith('#')) {
      id = id.substring(1);
    }

    const el = document.getElementById(id);
    if (!el) {
      return;
    }

    el.scrollIntoView({
      behavior: 'smooth',
      block,
    });

    setTimeout(() => {
      window.location.hash = `#${id}`;
    }, 500);
  }

  public toggleSearch() {
    this.showSearch.set(!this.showSearch());

    if (!this.showSearch()) {
      this.setSearchValue(undefined);
    }
  }

  public setSearchValue(str: string | null | undefined) {
    this.rulesService.resetVisibility();

    if (str === null || str === undefined) {
      this.showSearch.set(false);
    } else {
      this.search.set(str);
    }
  }
}
