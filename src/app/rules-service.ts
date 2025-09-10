import { computed, Injectable, signal } from '@angular/core';
import {
  type FAQEntry,
  type GameRule,
  type RuleFAQData,
} from 'src/app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class RulesService {
  public rules = signal<GameRule[]>([]);
  public faq = signal<FAQEntry[]>([]);

  public navHeaders = computed(() =>
    this.rules().map((rule) => ({
      ...rule,
    })),
  );

  public setRules(entries: RuleFAQData) {
    console.log(entries);
    if (!entries) return;
    this.rules.set(entries.rules);
    this.faq.set(entries.faq);
  }

  indexesToRules: Record<string, string> = {};
  indexVisibilityHash: Record<string, boolean> = {};
  setVisibility(index: string) {}
  resetVisibility() {}
}
