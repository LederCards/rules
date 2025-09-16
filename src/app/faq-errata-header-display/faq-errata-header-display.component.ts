import { Component, input } from '@angular/core';
import { type GameRule } from 'src/app/interfaces';

@Component({
  selector: 'app-faq-errata-header-display',
  templateUrl: './faq-errata-header-display.component.html',
  styleUrls: ['./faq-errata-header-display.component.scss'],
})
export class FaqErrataHeaderDisplayComponent {
  public rule = input.required<GameRule>();
}
