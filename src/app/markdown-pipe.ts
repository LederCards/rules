import { inject, Pipe, type PipeTransform } from '@angular/core';
import { marked } from 'marked';
import { getCustomRenderer } from 'src/app/renderer';
import { RulesService } from 'src/app/rules-service';

@Pipe({
  name: 'markdown',
})
export class MarkdownPipe implements PipeTransform {
  private ruleService = inject(RulesService);

  transform(value: string): unknown {
    const renderer = getCustomRenderer(
      this.ruleService.formattedRules(),
      this.ruleService.indexRuleHash(),
    );

    return marked(value, {
      renderer,
    });
  }
}
