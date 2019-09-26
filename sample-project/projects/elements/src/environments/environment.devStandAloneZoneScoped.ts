import { ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

export const environment = {
  production: false,
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.Default,
  zoneLess: false,
  zoneScoped: true,
  preCompiled: true
};
