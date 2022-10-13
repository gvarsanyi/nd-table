import { ReadonlyTable } from '../readonly-table.class.js';
import { cellDefaultRenderer } from './cell-default-renderer.js';
import { CellOptions } from './cell-options.type';
import { CellRenderOptions } from './cell-render-options.type';

export const OPT_ALIGN = ['left', 'center', 'right'] as const;
export const OPT_BORDERS = ['borderBottom', 'borderLeft', 'borderRight', 'borderTop'] as const;
export const OPT_COLORS = ['black', 'blue', 'cyan', 'default', 'green', 'magenta', 'red', 'white', 'yellow'] as const;
export const OPT_VALIGN = ['top', 'middle', 'bottom'] as const;
export const OPT_SIZES = ['width', 'height', 'maxWidth', 'maxHeight'] as const;

const nonRenderOptions: Exclude<keyof CellOptions, keyof CellRenderOptions>[] =
    ['borderBottom', 'borderLeft', 'borderRight', 'borderTop', 'renderer'];

export function cellRenderOptions(table: ReadonlyTable, x: number, y: number): [Required<CellOptions>['renderer'], CellRenderOptions] {
  const options = Object.assign({},
    table.tableOptions, table.rowOptions[y], table.columnOptions[x], table.cellOptions[x][y]) as CellOptions;
  const renderer = options.renderer;
  for (const key of nonRenderOptions) {
    delete options[key];
  }
  return [renderer || cellDefaultRenderer, options];
}
