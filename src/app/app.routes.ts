import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: async () =>
      await import('./rules/rules.page').then((m) => m.RulesPage),
  },
];
