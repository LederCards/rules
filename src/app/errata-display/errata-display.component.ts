import { Component, computed, HostBinding, inject, input } from '@angular/core';
import { MarkdownPipe } from 'src/app/markdown-pipe';
import { ParamService } from 'src/app/param-service';
import { RulesService } from 'src/app/rules-service';

@Component({
  selector: 'app-errata-display',
  templateUrl: './errata-display.component.html',
  styleUrls: ['./errata-display.component.scss'],
  imports: [MarkdownPipe],
})
export class ErrataDisplayComponent {
  private rulesService = inject(RulesService);
  private paramService = inject(ParamService);

  @HostBinding('class.ion-hide')
  public get isHidden() {
    return !this.paramService.showErrata();
  }

  public index = input.required<string>();

  public erratasForIndex = computed(
    () =>
      this.paramService.erratasJson[this.paramService.currentProduct()]?.[
        this.paramService.currentLocale()
      ]?.filter(
        (errata) =>
          errata.laws.includes(this.index()) &&
          (!errata.versions ||
            errata.versions.includes(this.paramService.currentVersion())),
      ) ?? [],
  );
}
