import { Component, computed, inject, OnInit } from '@angular/core';
import { get } from 'es-toolkit/compat';
import { linkedQueryParam } from 'ngxtension/linked-query-param';
import { HighlightPipe } from 'src/app/highlight-pipe';
import { RulesService } from 'src/app/rules-service';

@Component({
  selector: 'app-rules-display',
  templateUrl: './rules-display.component.html',
  styleUrls: ['./rules-display.component.scss'],
  imports: [HighlightPipe],
})
export class RulesDisplayComponent implements OnInit {
  private rulesService = inject(RulesService);

  readonly search = linkedQueryParam('search', {
    defaultValue: 'en-US',
  });

  public allRules = computed(() => this.rulesService.rules());
  public ruleIndexes = computed(() => this.rulesService.indexesToRules);

  constructor() {}

  ngOnInit() {}

  public isVisible(index: number[]): boolean {
    if (!this.search()) {
      return true;
    }
    return get(
      this.rulesService.indexVisibilityHash,
      [...index, 'visible'],
      false,
    );
  }
}
