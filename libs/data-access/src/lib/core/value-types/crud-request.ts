import type { EntityId } from './entity-id';
import type { LifecycleStatus } from './lifecycle';
import type { PageRequest } from './pagination';
import type { MutationMetadata } from './mutation-metadata';

/** Query contract shared by all CRUD repositories. */
export interface ListRequest<TFilter = unknown> {
  readonly page: PageRequest;
  readonly filter?: TFilter;
  /** Lifecycle states selected by the authorized application use case. */
  readonly lifecycle?: readonly LifecycleStatus[];
}

/** Request for one record by stable identifier. */
export interface GetRequest {
  readonly id: EntityId;
  /** Lifecycle states explicitly visible to this read. */
  readonly lifecycle?: readonly LifecycleStatus[];
}

/** Creation command with technical audit metadata. */
export interface CreateRequest<TCreate> {
  readonly metadata: MutationMetadata;
  readonly input: TCreate;
}

/** Lifecycle command targeting one record. */
export interface RecordCommand {
  readonly metadata: MutationMetadata;
  readonly id: EntityId;
  /** Revision returned by the last read; required for optimistic concurrency. */
  readonly expectedRevision: number;
}
