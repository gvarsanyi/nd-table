import { CellBorderOptions } from './cell-border-options.type';
import { CellOptions } from './cell-options.type';

const borderSwitchPairs: { [key in keyof Required<CellBorderOptions>]: keyof CellBorderOptions } = {
  borderBottom: 'borderRight',
  borderLeft: 'borderTop',
  borderRight: 'borderBottom',
  borderTop: 'borderLeft'
};

/**
 * borderTop <-> borderLeft
 * borderBottom <-> borderRight
 * @param options switch target
 */
export function cellOptionsFlipBorder(options: CellOptions): void {
  const tmp: CellBorderOptions = {};
  for (const key of Object.keys(borderSwitchPairs) as (keyof CellBorderOptions)[]) {
    if (options[key] != null) {
      tmp[borderSwitchPairs[key]] = options[key];
      delete options[key];
    }
  }
  Object.assign(options, tmp);
}
