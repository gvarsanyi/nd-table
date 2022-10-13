import { ReadonlyTable } from '../readonly-table.class.js';
import { CellRenderOptions } from './cell-render-options.type';
import { CellValue } from './cell-value.type';

/**
 * Parse cell value to string
 * @param value original value
 * @param x coordinate
 * @param y coordinate
 * @param options blended cell options
 * @param table table snapshot
 * @returns string value
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function cellDefaultRenderer(value: CellValue, x: number, y: number, options: CellRenderOptions, table: ReadonlyTable): string {
  let str = '';
  if (value === true) {
    str = '✓';
  } else if (value === false) {
    str = '✗';
  } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'bigint' || (value && typeof value === 'object')) {
    str = String(value);
  }
  return str;
}
