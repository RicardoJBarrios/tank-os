/** Reads an optional named regular-expression group. */
export function readMatchGroup(
  match: RegExpExecArray | undefined,
  name: string,
): string | undefined {
  return match?.groups?.[name];
}
