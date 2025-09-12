import { Component, computed, HostBinding, inject, input } from '@angular/core';
import { MarkdownPipe } from 'src/app/markdown-pipe';
import { ParamService } from 'src/app/param-service';

@Component({
  selector: 'app-errata-display',
  templateUrl: './errata-display.component.html',
  styleUrls: ['./errata-display.component.scss'],
  imports: [MarkdownPipe],
})
export class ErrataDisplayComponent {
  private paramService = inject(ParamService);

  @HostBinding('class.ion-hide')
  public get isHidden() {
    return !this.paramService.showErrata();
  }

  public index = input.required<string>();

  public erratasForIndex = computed(
    () =>
      this.paramService
        .currentErrata()
        .filter(
          (errata) =>
            errata.rules.includes(this.index()) &&
            (!errata.printings ||
              errata.printings.includes(this.paramService.currentPrinting())),
        ) ?? [],
  );
}
