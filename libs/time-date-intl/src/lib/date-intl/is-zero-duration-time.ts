/** Returns whether every fixed time component is zero. */
export function isZeroDurationTime(
  hours: number,
  minutes: number,
  seconds: number,
  milliseconds: number,
): boolean {
  return hours === 0 && minutes === 0 && seconds === 0 && milliseconds === 0;
}
