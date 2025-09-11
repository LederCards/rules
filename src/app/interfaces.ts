export interface AppData {
  products: Record<string, { name: string }>;
  languages: Record<string, { name: string }>;
}

export interface I18NData {
  [game: string]: {
    [locale: string]: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      appconfig: Record<string, any>;
    };
  };
}

export interface RuleFAQData {
  rules: GameRule[];
  faq: FAQEntry[];
}

export interface RuleData {
  [game: string]: {
    [locale: string]: {
      [version: string]: RuleFAQData;
    };
  };
}

export interface FAQEntryQA {
  q: string;
  a: string;
}

export interface FAQEntry {
  category: string;
  color: string;
  questions: FAQEntryQA[];
}

export interface GameRule {
  name: string;
  plainName?: string;
  formattedName: string;
  icon?: string;
  index: string;

  color: string;
  pretext: string;
  text: string;
  children: GameRule[];
}
