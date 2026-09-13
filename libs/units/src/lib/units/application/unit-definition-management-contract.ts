import type {
  EntityId,
  GetRequest,
  ListRequest,
  Page,
} from '@tankos/data-access';
import type { AuthorizationSubject } from '@tankos/authz';
import type {
  UnitDefinition,
  UnitDefinitionFilter,
  UnitSymbolPosition,
  UnitSymbolSpacing,
} from '../core';
import type { UnitDefinitionRecord } from './unit-definition-record';

/** Form data accepted by the custom-unit management use case. */
export interface CustomUnitDefinitionDraft {
  readonly code: string;
  readonly symbol: string;
  readonly asciiFallback: string;
  readonly position?: UnitSymbolPosition;
  readonly spacing?: UnitSymbolSpacing;
}

export interface CreateCustomUnitRequest {
  readonly subject: AuthorizationSubject;
  readonly draft: CustomUnitDefinitionDraft;
}

export interface ReplaceCustomUnitRequest extends CreateCustomUnitRequest {
  readonly id: EntityId;
  readonly expectedRevision: number;
  /** Required current value preserves ownership and immutable identity. */
  readonly current: UnitDefinition;
}

export interface PublishUnitDefinitionRequest {
  readonly subject: AuthorizationSubject;
  readonly id: EntityId;
  readonly expectedRevision: number;
  readonly current: UnitDefinition;
  readonly currentLifecycle: UnitDefinitionRecord['lifecycle']['status'];
}

export interface ListUnitDefinitionsRequest extends ListRequest<UnitDefinitionFilter> {
  readonly subject: AuthorizationSubject;
}

export interface GetUnitDefinitionRequest extends GetRequest {
  readonly subject: AuthorizationSubject;
}

export interface UnitDefinitionLifecycleRequest {
  readonly subject: AuthorizationSubject;
  readonly id: EntityId;
  readonly expectedRevision: number;
}

/** Authorized application boundary for unit-catalogue management. */
export interface UnitDefinitionManagementService {
  list(
    request: ListUnitDefinitionsRequest,
  ): Promise<Page<UnitDefinitionRecord>>;
  get(
    request: GetUnitDefinitionRequest,
  ): Promise<UnitDefinitionRecord | undefined>;
  save(
    request: CreateCustomUnitRequest | ReplaceCustomUnitRequest,
  ): Promise<UnitDefinitionRecord>;
  publish(request: PublishUnitDefinitionRequest): Promise<UnitDefinitionRecord>;
  markForDeletion(
    request: UnitDefinitionLifecycleRequest,
  ): Promise<UnitDefinitionRecord>;
  restore(
    request: UnitDefinitionLifecycleRequest,
  ): Promise<UnitDefinitionRecord>;
  delete(request: UnitDefinitionLifecycleRequest): Promise<void>;
}
