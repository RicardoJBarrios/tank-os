import { inject } from '@angular/core';
import type { Route } from '@angular/router';
import { AUTH_SESSION } from '@tankos/authn';
import { FEEDBACK_SERVICE } from '@tankos/feedback';
import { AquariumEditorPage } from './aquarium-editor-page';
import { AquariumFeatureService } from './aquarium-feature-service';
import { AquariumListPage } from './aquarium-list-page';
import { AquariumDetailPage } from './aquarium-detail-page';
import {
  ACCESSIBLE_AQUARIUM_READER,
  AQUARIUM_MANAGER,
  AQUARIUM_ESTABLISHER,
} from './aquarium-tokens';

export const aquariumRoutes: Route[] = [
  {
    path: '',
    providers: [
      {
        provide: AquariumFeatureService,
        useFactory: () =>
          new AquariumFeatureService(
            inject(ACCESSIBLE_AQUARIUM_READER),
            inject(AQUARIUM_ESTABLISHER),
            inject(AQUARIUM_MANAGER),
            inject(AUTH_SESSION),
            inject(FEEDBACK_SERVICE),
          ),
      },
    ],
    children: [
      { path: '', component: AquariumListPage },
      { path: 'new', component: AquariumEditorPage },
      { path: ':id/edit', component: AquariumEditorPage },
      { path: ':id', component: AquariumDetailPage },
    ],
  },
];
