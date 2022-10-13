import { CellOptions } from './cell-options.type';
import { CellValue } from './cell-value.type';

export type CellValueOrValueWithOptions = ({ value: CellValue } & CellOptions) | CellValue;

export function cellValueAndOptions(input: CellValueOrValueWithOptions): [CellValue, CellOptions] {
  if (input && typeof input === 'object') {
    return [input.value, input];
  }
  return [input, {}];
}
