import { Component, computed, effect, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { get } from 'es-toolkit/compat';
import { HighlightPipe } from 'src/app/highlight-pipe';
import { ParamService } from 'src/app/param-service';
import { RulesService } from 'src/app/rules-service';
import { ErrataDisplayComponent } from '../errata-display/errata-display.component';
import { FaqDisplayComponent } from '../faq-display/faq-display.component';
import { FaqErrataHeaderDisplayComponent } from '../faq-errata-header-display/faq-errata-header-display.component';

@Component({
  selector: 'app-rules-display',
  templateUrl: './rules-display.component.html',
  styleUrls: ['./rules-display.component.scss'],
  imports: [
    HighlightPipe,
    FaqDisplayComponent,
    ErrataDisplayComponent,
    TranslateModule,
    FaqErrataHeaderDisplayComponent,
  ],
})
export class RulesDisplayComponent {
  public rulesService = inject(RulesService);
  public paramService = inject(ParamService);

  public allRules = computed(() => this.rulesService.formattedRules());
  public ruleIndexes = computed(() => this.rulesService.indexRuleHash());

  public isDisplayingNothing = computed(() => {
    if (this.paramService.showRules()) return false;

    if (this.paramService.showFAQ() && this.rulesService.faq().length > 0)
      return false;
    if (
      this.paramService.showErrata() &&
      this.paramService.currentErrata().length > 0
    )
      return false;

    return true;
  });

  constructor() {
    effect(() => {
      if (!this.isDisplayingNothing()) return;

      this.paramService.showRules.set(true);
    });
  }

  public isVisible(index: number[]): boolean {
    const searchTerm = this.rulesService.search().trim();
    if (!searchTerm) {
      return true;
    }

    return get(
      this.rulesService.indexVisibilityHash(),
      [...index, 'visible'],
      false,
    );
  }

  public hasFAQ(index: string): boolean {
    return this.rulesService.faq().some((faq) => faq.rules.includes(index));
  }

  public hasErrata(index: string): boolean {
    return this.paramService
      .currentErrata()
      .some((errata) => errata.rules.includes(index));
  }
}
