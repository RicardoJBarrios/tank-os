import { assertInstantParts } from './assert-instant-parts';
import { parseInstantParts } from './parse-instant-parts';

/** Parses a validated ISO instant string into epoch milliseconds. */
export function parseInstantString(value: string): number {
  const parts = parseInstantParts(value);
  assertInstantParts(value, parts);
  const groups = parts.groups as Record<string, string>;
  const milliseconds = (groups['fraction'] ?? '').slice(0, 3).padEnd(3, '0');
  return new Date(
    `${groups['year']}-${groups['month']}-${groups['day']}T${groups['hour']}:${groups['minute']}:${groups['second']}.${milliseconds}${groups['offset']}`,
  ).getTime();
}
