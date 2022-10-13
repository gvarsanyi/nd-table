
export function cellPosCheck(coord: 'x' | 'y', pos: number): void {
  if (!Number.isInteger(pos) || pos < -1) {
    throw new Error(`Table position must be integer and >= -1 (received ${coord}:${pos}`);
  }
}
