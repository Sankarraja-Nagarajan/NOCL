export function isNullOrEmpty(str: string | null | undefined | any): boolean {
  return str === null || str === undefined || str === "";
}

export function isNullOrWhiteSpace(
  str: string | null | undefined | any
): boolean {
  return str === null || str === undefined || str.trim() === "";
}
