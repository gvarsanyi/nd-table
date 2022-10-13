import { CellBorderOptions } from './cell-border-options.type';
import { cellDefaultRenderer } from './cell-default-renderer.js';
import { CellRenderOptions } from './cell-render-options.type';

export interface CellOptions extends CellBorderOptions, CellRenderOptions {
  /** function to render a cell value to string */
  renderer?: typeof cellDefaultRenderer;
}
