import type { Aquarium, AquariumId, AquariumName } from '../domain/aquarium';
import type {
  AccessContext,
  CrudRecord,
  LifecycleStatus,
} from '@tankos/data-access';

export interface EstablishAquariumInput {
  readonly name: AquariumName;
  readonly keeperId: string;
  /** Only an admin may set this to a different principal. */
  readonly ownerKeeperId?: string;
}

export interface AquariumEstablisher {
  establish(input: EstablishAquariumInput): Promise<Aquarium>;
}

export interface AquariumListItem {
  readonly id: AquariumId;
  readonly name: AquariumName;
  readonly establishedByKeeperId: string;
  readonly lifecycleStatus: LifecycleStatus;
}

export interface AccessibleAquariumReader {
  listAccessible(keeperId: string): Promise<readonly AquariumListItem[]>;
  getAccessible(
    keeperId: string,
    aquariumId: AquariumId,
  ): Promise<AquariumListItem | null>;
}

export interface AquariumManager {
  get(
    access: AccessContext,
    id: AquariumId,
  ): Promise<CrudRecord<Aquarium> | undefined>;
  rename(
    access: AccessContext,
    id: AquariumId,
    name: AquariumName,
  ): Promise<void>;
  markForDeletion(access: AccessContext, id: AquariumId): Promise<void>;
  restore(access: AccessContext, id: AquariumId): Promise<void>;
  deletePermanently(access: AccessContext, id: AquariumId): Promise<void>;
}
