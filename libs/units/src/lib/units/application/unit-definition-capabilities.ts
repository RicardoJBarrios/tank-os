import { AUTHORIZATION_ROLES, type AuthorizationSubject } from '@tankos/authz';
import type { UnitDefinition } from '../core';
import {
  UNIT_DEFINITION_RESOURCE,
  unitDefinitionAuthorization,
  type UnitDefinitionAuthorizationAction,
  type UnitDefinitionAuthorizationAttributes,
} from './unit-definition-authorization-policy';

export interface UnitDefinitionCapabilities {
  readonly canCreate: boolean;
  readonly canRead: boolean;
  readonly canUse: boolean;
  readonly canEdit: boolean;
  readonly canDelete: boolean;
  readonly canRestore: boolean;
  readonly canPublish: boolean;
  readonly canInspectDeleted: boolean;
  readonly canFilterByOwner: boolean;
}

/** Calculates UI-neutral capabilities from the domain ABAC policy. */
export function unitDefinitionCapabilities(
  subject: AuthorizationSubject,
  record?: UnitDefinition,
): UnitDefinitionCapabilities {
  const attributes = {
    ownerId: record ? record.ownerId : subject.id,
    visibility: record?.visibility ?? 'private',
  };
  return {
    canCreate: canUnitAction(subject, attributes, 'create'),
    canRead: canUnitAction(subject, attributes, 'read'),
    canUse: canUnitAction(subject, attributes, 'use'),
    canEdit: record ? canUnitAction(subject, attributes, 'update') : false,
    canDelete: record ? canUnitAction(subject, attributes, 'delete') : false,
    canRestore: record ? canUnitAction(subject, attributes, 'restore') : false,
    canPublish: record ? canUnitAction(subject, attributes, 'publish') : false,
    canInspectDeleted: subject.roles.includes(AUTHORIZATION_ROLES.ADMIN),
    canFilterByOwner: subject.roles.includes(AUTHORIZATION_ROLES.ADMIN),
  };
}

function canUnitAction(
  subject: AuthorizationSubject,
  attributes: UnitDefinitionAuthorizationAttributes,
  action: UnitDefinitionAuthorizationAction,
): boolean {
  return unitDefinitionAuthorization({
    subject,
    action,
    resource: { type: UNIT_DEFINITION_RESOURCE, attributes },
  });
}
