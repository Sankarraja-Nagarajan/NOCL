export function isArrayEmpty(arr: any[] | null | undefined): boolean {
  return arr === null || arr === undefined || arr.length === 0;
}

export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

export function isArrayInclude(src: any[], child: any[]): boolean {
  return src.some((x) =>
    child.some((y) =>
      x.toString().toLowerCase().includes(y.toString().toLowerCase())
    )
  );
}
