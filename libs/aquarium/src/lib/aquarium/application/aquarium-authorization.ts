import {
  AUTHORIZATION_ROLES,
  hasAuthorizationRole,
  type AuthorizationRequest,
} from '@tankos/authz';

export const AQUARIUM_RESOURCE_TYPE = 'aquarium';

export const AQUARIUM_ACTIONS = {
  CREATE: 'aquarium.create',
  READ: 'aquarium.read',
  UPDATE: 'aquarium.update',
  MANAGE_TOPOLOGY: 'aquarium.manage-topology',
  MANAGE_MEMBERS: 'aquarium.manage-members',
  DELETE: 'aquarium.delete',
  RESTORE: 'aquarium.restore',
  DELETE_PHYSICALLY: 'aquarium.delete-physically',
} as const;

export type AquariumAction =
  (typeof AQUARIUM_ACTIONS)[keyof typeof AQUARIUM_ACTIONS];

export interface AquariumAuthorizationAttributes {
  readonly ownerKeeperId?: string;
  readonly grantedActions?: readonly string[];
  readonly lifecycleStatus?: string;
}

/**
 * Evaluates Aquarium permissions using the shared authz subject/resource
 * contract. The initial keeper association acts as the bootstrap grant until
 * explicit membership grants are persisted for the resource.
 */
export function aquariumAuthorizationPolicy(
  request: AuthorizationRequest<AquariumAuthorizationAttributes>,
): boolean {
  if (hasAuthorizationRole(request.subject, AUTHORIZATION_ROLES.ADMIN)) {
    return (
      request.action !== AQUARIUM_ACTIONS.DELETE_PHYSICALLY ||
      request.resource.attributes.lifecycleStatus === 'marked-for-deletion'
    );
  }

  if (!hasAuthorizationRole(request.subject, AUTHORIZATION_ROLES.KEEPER))
    return false;

  if (request.action === AQUARIUM_ACTIONS.CREATE) {
    return request.resource.attributes.ownerKeeperId === request.subject.id;
  }

  const grantedActions = request.resource.attributes.grantedActions ?? [];
  if (grantedActions.includes(request.action)) return true;

  return (
    request.resource.attributes.ownerKeeperId === request.subject.id &&
    !request.resource.attributes.grantedActions &&
    request.action !== AQUARIUM_ACTIONS.DELETE_PHYSICALLY
  );
}
