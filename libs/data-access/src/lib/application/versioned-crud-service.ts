import type { CrudRecord, RecordCommand } from '../core';
import type { CrudService } from './crud-service';

/** CRUD service whose replacement creates a new record before retiring the old one. */
export type VersionedCrudService<
  TData,
  TCreate,
  TUpdate,
  TFilter = unknown,
> = CrudService<TData, TCreate, TUpdate, TFilter>;

type VersionedCrudSource<TData, TCreate, TUpdate, TFilter> = Omit<
  CrudService<TData, TCreate, TUpdate, TFilter>,
  'replace'
>;

/** Converts replacement input into the payload of the new version. */
export interface VersionedCrudServiceOptions<TData, TUpdate> {
  /** Required provider transaction; versioned replacement is never emulated. */
  readonly replaceAtomically: (
    request: RecordCommand,
    input: TUpdate,
  ) => Promise<CrudRecord<TData>>;
  /** Domain validation that must run before the replacement is created. */
  readonly validateReplace?: (
    current: CrudRecord<TData>,
    input: TUpdate,
  ) => void | Promise<void>;
}

/**
 * Applies the shared immutable-version replacement workflow to a CRUD service.
 *
 * Replacement is delegated to one provider transaction. A non-atomic
 * create-then-retire fallback is deliberately not part of this contract.
 */
export function createVersionedCrudService<
  TData,
  TCreate,
  TUpdate,
  TFilter = unknown,
>(
  service: VersionedCrudSource<TData, TCreate, TUpdate, TFilter>,
  options: VersionedCrudServiceOptions<TData, TUpdate>,
): VersionedCrudService<TData, TCreate, TUpdate, TFilter> {
  return {
    ...service,
    replace: async (
      request: RecordCommand,
      input: TUpdate,
    ): Promise<CrudRecord<TData>> => {
      await validateReplacement(service, options, request, input);
      return options.replaceAtomically(request, input);
    },
  };
}

async function validateReplacement<TData, TCreate, TUpdate, TFilter>(
  service: VersionedCrudSource<TData, TCreate, TUpdate, TFilter>,
  options: VersionedCrudServiceOptions<TData, TUpdate>,
  request: RecordCommand,
  input: TUpdate,
): Promise<void> {
  if (!options.validateReplace) return;
  const current = await service.get({ id: request.id });
  if (current) await options.validateReplace(current, input);
}
