import { DurationInput, TimePort } from '@tankos/time';
import { DurationDisplayOptions } from '../contracts';
import { durationParts } from './duration-parts';
import { formatDigitalDuration } from './format-digital-duration';

/** Formats a fixed duration using ISO, digital or localized unit notation. */
export function formatAngularDuration(
  timePort: TimePort,
  defaultLocale: string,
  value: DurationInput,
  options?: DurationDisplayOptions,
): string {
  const style = options?.style ?? 'short';
  if (style === 'iso') return timePort.toDurationIsoString(value);
  const milliseconds = timePort.parseDuration(value).milliseconds;
  const sign = milliseconds < 0 ? '-' : '';
  const parts = durationParts(Math.abs(milliseconds));
  if (style === 'digital') return `${sign}${formatDigitalDuration(parts)}`;
  const units = [
    ['day', parts.days],
    ['hour', parts.hours],
    ['minute', parts.minutes],
    ['second', parts.seconds],
    ['millisecond', parts.milliseconds],
  ] as const;
  const visible = units.filter(([, amount]) => amount > 0);
  if (visible.length === 0) visible.push(['millisecond', 0]);
  const formatted = visible.map(([unit, amount]) =>
    new Intl.NumberFormat(options?.locale ?? defaultLocale, {
      style: 'unit',
      unit,
      unitDisplay: style === 'long' ? 'long' : 'short',
    }).format(amount),
  );
  return `${sign}${formatted.join(', ')}`;
}
