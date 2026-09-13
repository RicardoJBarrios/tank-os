import type {
  CrudRecord,
  EntityId,
  LifecycleStatus,
  ListRequest,
  Page,
  PageRequest,
  PageCursor,
  RecordCommand,
} from '@tankos/data-access';
import type { Logger } from '@tankos/observability';

/** State status exposed by the reusable CRUD list store. */
export type CrudListStatus = 'idle' | 'loading' | 'ready' | 'error';

/** Consistent outcome returned by every recoverable CRUD-list operation. */
export type CrudOperationResult<TValue = void> =
  | { readonly ok: true; readonly value: TValue }
  | { readonly ok: false; readonly error: unknown };

/** State owned by one paginated CRUD list flow. */
export interface CrudListState<TData, TFilter> {
  readonly status: CrudListStatus;
  readonly items: readonly CrudRecord<TData>[];
  readonly filter: TFilter | undefined;
  readonly nextCursor: PageCursor | undefined;
  readonly hasMore: boolean;
  readonly selectedIds: readonly EntityId[];
  readonly error: unknown;
}

/** Minimal application API consumed by the reusable list store. */
export interface CrudListService<TData, TFilter> {
  list(request: ListRequest<TFilter>): Promise<Page<CrudRecord<TData>>>;
  markForDeletion(request: RecordCommand): Promise<CrudRecord<TData>>;
  restore(request: RecordCommand): Promise<CrudRecord<TData>>;
}

/** Dependencies and query defaults used to create a CRUD list store. */
export interface CrudListStoreOptions<TData, TFilter> {
  readonly service: CrudListService<TData, TFilter>;
  readonly page: PageRequest;
  /** Lifecycle states that the feature wants to show in the list. */
  readonly lifecycle?:
    | readonly LifecycleStatus[]
    | ((filter: TFilter | undefined) => readonly LifecycleStatus[]);
  /** Optional host logger; absent means no logging. */
  readonly logger?: Logger;
}
