export function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function pickFrom<T>(input: string, items: readonly T[]): T {
  return items[hashString(input) % items.length];
}

export function rangeFrom(input: string, min: number, max: number): number {
  return min + (hashString(input) % (max - min + 1));
}
