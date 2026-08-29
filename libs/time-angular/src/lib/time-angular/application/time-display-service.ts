import { inject, Injectable } from '@angular/core';
import { DurationInput, InstantInput, LocalDateInput } from '@tankos/time';
import {
  DurationDisplayOptions,
  HumanizeDurationOptions,
  LocalDateDisplayOptions,
  TimeDisplayOptions,
} from '../contracts';
import { TIME_DISPLAY_ADAPTER, TIME_DISPLAY_CONTEXT } from './time-tokens';

/** Angular facade for temporal presentation operations. */
@Injectable({ providedIn: 'root' })
export class TimeDisplayService {
  readonly #adapter = inject(TIME_DISPLAY_ADAPTER);
  readonly #context = inject(TIME_DISPLAY_CONTEXT, { optional: true }) ?? {};

  /** Formats an instant for user-facing display. */
  public formatInstant(
    value: InstantInput,
    options?: TimeDisplayOptions,
  ): string {
    return this.#adapter.formatInstant(value, {
      ...options,
      timeZone:
        options?.timeZone ??
        this.#context.aquariumTimeZone ??
        this.#context.userTimeZone ??
        'UTC',
    });
  }

  /** Formats an instant using the aquarium zone, then user zone, then UTC. */
  public formatInstantForAquarium(
    value: InstantInput,
    options?: Omit<TimeDisplayOptions, 'timeZone'>,
  ): string {
    return this.#adapter.formatInstant(value, {
      ...options,
      timeZone:
        this.#context.aquariumTimeZone ?? this.#context.userTimeZone ?? 'UTC',
    });
  }

  /** Formats an instant using the user zone, falling back to UTC. */
  public formatInstantForUser(
    value: InstantInput,
    options?: Omit<TimeDisplayOptions, 'timeZone'>,
  ): string {
    return this.#adapter.formatInstant(value, {
      ...options,
      timeZone: this.#context.userTimeZone ?? 'UTC',
    });
  }

  /** Formats a calendar date without time-zone conversion. */
  public formatLocalDate(
    value: LocalDateInput,
    options?: LocalDateDisplayOptions,
  ): string {
    return this.#adapter.formatLocalDate(value, options);
  }

  /** Formats an elapsed duration for user-facing display. */
  public formatDuration(
    value: DurationInput,
    options?: DurationDisplayOptions,
  ): string {
    return this.#adapter.formatDuration(value, options);
  }

  /** Formats an elapsed duration as localized relative text. */
  public formatHumanizedDuration(
    value: DurationInput,
    options?: HumanizeDurationOptions,
  ): string {
    return this.#adapter.formatHumanizedDuration(value, options);
  }
}
