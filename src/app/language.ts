import { Subject } from 'rxjs';
import { type I18NData } from 'src/app/interfaces';

export const languageData$ = new Subject<I18NData>();
