import { Component, computed, HostBinding, inject, input } from '@angular/core';
import { MarkdownPipe } from 'src/app/markdown-pipe';
import { ParamService } from 'src/app/param-service';
import { RulesService } from 'src/app/rules-service';

@Component({
  selector: 'app-faq-display',
  templateUrl: './faq-display.component.html',
  styleUrls: ['./faq-display.component.scss'],
  imports: [MarkdownPipe],
})
export class FaqDisplayComponent {
  private rulesService = inject(RulesService);
  private paramService = inject(ParamService);

  @HostBinding('class.ion-hide')
  public get isHidden() {
    return !this.paramService.showFAQ();
  }

  public index = input.required<string>();

  public faqsForIndex = computed(() =>
    this.rulesService.faq().filter((faq) => faq.rules.includes(this.index())),
  );
}
