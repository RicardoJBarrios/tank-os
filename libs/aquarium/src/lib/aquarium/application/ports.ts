import type { Aquarium, AquariumId, AquariumName } from '../domain/aquarium';
import type { CrudRecord, LifecycleStatus } from '@tankos/data-access';
import type { AuthorizationSubject } from '@tankos/authz';

export interface EstablishAquariumInput {
  readonly name: AquariumName;
  readonly keeperId: string;
  /** Only an admin may set this to a different principal. */
  readonly ownerKeeperId?: string;
}

export interface AquariumEstablisher {
  establish(
    subject: AuthorizationSubject,
    input: EstablishAquariumInput,
  ): Promise<Aquarium>;
}

export interface AquariumListItem {
  readonly id: AquariumId;
  readonly name: AquariumName;
  readonly establishedByKeeperId: string;
  readonly lifecycleStatus: LifecycleStatus;
}

export interface AccessibleAquariumReader {
  listAccessible(
    subject: AuthorizationSubject,
  ): Promise<readonly AquariumListItem[]>;
  getAccessible(
    subject: AuthorizationSubject,
    aquariumId: AquariumId,
  ): Promise<AquariumListItem | null>;
}

export interface AquariumManager {
  get(
    subject: AuthorizationSubject,
    id: AquariumId,
  ): Promise<CrudRecord<Aquarium> | undefined>;
  rename(
    subject: AuthorizationSubject,
    id: AquariumId,
    name: AquariumName,
  ): Promise<void>;
  markForDeletion(subject: AuthorizationSubject, id: AquariumId): Promise<void>;
  restore(subject: AuthorizationSubject, id: AquariumId): Promise<void>;
  deletePermanently(
    subject: AuthorizationSubject,
    id: AquariumId,
  ): Promise<void>;
}
