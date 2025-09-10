import { inject, Pipe, type PipeTransform } from '@angular/core';
import { RulesService } from 'src/app/rules-service';

@Pipe({
  name: 'highlight',
})
export class HighlightPipe implements PipeTransform {
  private rulesService = inject(RulesService);

  transform(value: string, searchString: string, mutateIndex?: string): string {
    if (!searchString || !value) {
      return value;
    }

    const re = new RegExp(`<img.*?>|(${searchString})`, 'gi');
    return value.replace(re, (img: string, match: string) => {
      if (!match) {
        return img;
      }

      if (mutateIndex) {
        this.rulesService.setVisibility(mutateIndex);
      }

      return '<mark>' + match + '</mark>';
    });
  }
}
