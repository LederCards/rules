import { computed, Injectable, signal } from '@angular/core';
import { marked } from 'marked';
import {
  type FAQEntryQA,
  type GameRule,
  type RuleFAQData,
} from 'src/app/interfaces';
import { getCustomRenderer } from 'src/app/renderer';
import { slugTitle } from 'src/app/slugtitle';

@Injectable({
  providedIn: 'root',
})
export class RulesService {
  public rules = signal<GameRule[]>([]);
  public faq = signal<FAQEntryQA[]>([]);

  public formattedRules = signal<GameRule[]>([]);
  public indexRuleHash = signal<Record<string, string>>({});

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public indexVisibilityHash: Record<string, any> = {};

  public navHeaders = computed(() =>
    this.rules().map((rule, i) => ({
      ...rule,
      index: `${i + 1}.`,
    })),
  );

  public setRules(entries: RuleFAQData) {
    if (!entries) return;
    this.rules.set(entries.rules ?? []);
    this.faq.set(entries.faq ?? []);

    this.formatRules();
  }

  private formatRules() {
    const indexRuleHash: Record<string, string> = {};
    const allRules: GameRule[] = [];

    const buildIndex = (arr: number[]) => arr.join('.');

    const baseRules = structuredClone(this.rules());

    baseRules.forEach((rule, majorRuleIndex) => {
      rule.index = `${majorRuleIndex + 1}.`;
      allRules.push(rule);

      (rule.children || []).forEach((childRule, minorRuleIndex) => {
        childRule.index = buildIndex([majorRuleIndex + 1, minorRuleIndex + 1]);
        allRules.push(childRule);

        (childRule.children || []).forEach((grandchildRule, revRuleIndex) => {
          grandchildRule.index = buildIndex([
            majorRuleIndex + 1,
            minorRuleIndex + 1,
            revRuleIndex + 1,
          ]);
          allRules.push(grandchildRule);

          (grandchildRule.children || []).forEach(
            (descendantNode, descRuleIndex) => {
              descendantNode.index = buildIndex([
                majorRuleIndex + 1,
                minorRuleIndex + 1,
                revRuleIndex + 1,
                descRuleIndex + 1,
              ]);
              allRules.push(descendantNode);

              (descendantNode.children || []).forEach(
                (descDescendantNode, descDescRuleIndex) => {
                  descDescendantNode.index = buildIndex([
                    majorRuleIndex + 1,
                    minorRuleIndex + 1,
                    revRuleIndex + 1,
                    descRuleIndex + 1,
                    descDescRuleIndex + 1,
                  ]);
                  allRules.push(descDescendantNode);
                },
              );
            },
          );
        });
      });
    });

    allRules.forEach((rule) => {
      indexRuleHash[rule.index] = slugTitle(
        rule.index,
        rule.plainName || rule.name,
      );
    });

    const renderer = getCustomRenderer(baseRules, indexRuleHash);

    const format = (str: string) => {
      if (!str) {
        return;
      }

      return marked(str, {
        renderer,
      });
    };

    allRules.forEach((rule) => {
      rule.formattedName = format(rule.name) as string;
      rule.text = format(rule.text) as string;
      rule.pretext = format(rule.pretext) as string;
    });

    this.formattedRules.set(baseRules);
    this.indexRuleHash.set(indexRuleHash);
  }

  setVisibility(index: string) {
    setTimeout(() => {
      if (index.endsWith('.')) {
        index = index.substring(0, index.length - 1);
      }
      const allEntries = index.split('.');

      // take care of the first entry
      this.indexVisibilityHash[allEntries[0]] = this.indexVisibilityHash[
        allEntries[0]
      ] || { visible: true };

      let curObj = this.indexVisibilityHash[allEntries[0]];

      allEntries.shift();

      // iteratively do the rest
      allEntries.forEach((idx) => {
        curObj[idx] = curObj[idx] || { visible: true };
        curObj = curObj[idx];
      });
    }, 0);
  }

  resetVisibility() {
    this.indexVisibilityHash = {};
  }
}
