import { Component, computed, inject } from '@angular/core';
import { UnifiedDiffComponent } from 'ngx-diff';
import { type GameRule } from 'src/app/interfaces';
import { ParamService } from 'src/app/param-service';

@Component({
  selector: 'app-compare-rules',
  templateUrl: './compare-rules.component.html',
  styleUrls: ['./compare-rules.component.scss'],
  imports: [UnifiedDiffComponent],
})
export class CompareRulesComponent {
  private paramService = inject(ParamService);

  public primaryVersion = computed(() => this.paramService.currentPrinting());
  public compareVersion = computed(() => this.paramService.compareToPrinting());

  public primaryVersionData = computed(() =>
    this.paramService.getRulesForPrinting(this.primaryVersion()),
  );
  public compareVersionData = computed(() =>
    this.paramService.getRulesForPrinting(this.compareVersion()),
  );

  public primaryVersionString = computed(() =>
    this.buildRuleString(this.primaryVersionData()),
  );
  public compareVersionString = computed(() =>
    this.buildRuleString(this.compareVersionData()),
  );

  private buildRuleString(rules: GameRule[]): string {
    const stringifyRule = (rule: GameRule, index: string): string => {
      return [`${index} ${rule.name}`, rule.pretext, rule.text]
        .filter(Boolean)
        .join('\n');
    };

    const buildIndex = (indexes: number[]): string => {
      return indexes.map((i) => i + 1).join('.');
    };

    const allRules: string[] = [];

    rules.forEach((rule, ruleIndex) => {
      allRules.push(stringifyRule(rule, buildIndex([ruleIndex])));

      rule.children?.forEach((childRule, childIndex) => {
        allRules.push(
          stringifyRule(childRule, buildIndex([ruleIndex, childIndex])),
        );

        childRule.children?.forEach((grandChildRule, grandChildIndex) => {
          allRules.push(
            stringifyRule(
              grandChildRule,
              buildIndex([ruleIndex, childIndex, grandChildIndex]),
            ),
          );

          grandChildRule.children?.forEach((descRule, descIndex) => {
            allRules.push(
              stringifyRule(
                descRule,
                buildIndex([ruleIndex, childIndex, grandChildIndex, descIndex]),
              ),
            );

            descRule.children?.forEach((descDescRule, descDescIndex) => {
              allRules.push(
                stringifyRule(
                  descDescRule,
                  buildIndex([
                    ruleIndex,
                    childIndex,
                    grandChildIndex,
                    descIndex,
                    descDescIndex,
                  ]),
                ),
              );
            });
          });
        });
      });
    });

    return allRules.filter(Boolean).join('\n');
  }
}
