import { CommonModule } from '@angular/common';
import {
  type AfterContentInit,
  Component,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { arrowUpOutline, search } from 'ionicons/icons';
import { linkedQueryParam } from 'ngxtension/linked-query-param';
import { navigation$ } from 'src/app/navigation';
import { RulesService } from 'src/app/rules-service';

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
  ],
})
export class RulesPage implements AfterContentInit {
  private rulesService = inject(RulesService);

  readonly search = linkedQueryParam('search', {
    defaultValue: 'en-US',
  });

  public showSearch = signal<boolean>(false);
  public showScrollUp = signal<boolean>(false);

  @HostListener('document:click', ['$event'])
  public clickScreen($event: MouseEvent) {
    const hash = ($event.target as HTMLAnchorElement).hash;
    if (!$event.target || !hash) {
      return;
    }

    $event.preventDefault();
    $event.stopPropagation();

    this.scrollToEl(hash, 'start');
  }

  constructor() {
    addIcons({ arrowUpOutline, search });

    navigation$
      .pipe(takeUntilDestroyed())
      .subscribe((id) => this.scrollToEl(id, 'start'));
  }

  ngAfterContentInit() {
    setTimeout(() => {
      if (!window.location.hash) {
        return;
      }
      this.scrollToEl(window.location.hash, 'start');
    }, 1500);
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public scroll($event: any) {
    this.showScrollUp.set($event.detail.scrollTop > window.innerHeight);
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
