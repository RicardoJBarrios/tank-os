import { InjectionToken } from '@angular/core';
import type {
  AccessibleAquariumReader,
  AquariumEstablisher,
} from '@tankos/aquarium';

export const AQUARIUM_ESTABLISHER = new InjectionToken<AquariumEstablisher>(
  'AQUARIUM_ESTABLISHER',
);

export const ACCESSIBLE_AQUARIUM_READER =
  new InjectionToken<AccessibleAquariumReader>('ACCESSIBLE_AQUARIUM_READER');
