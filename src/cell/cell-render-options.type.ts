import { OPT_ALIGN, OPT_COLORS, OPT_VALIGN } from './cell-render-options.js';

export interface CellRenderOptions {
  align?: (typeof OPT_ALIGN)[number];
  bold?: boolean;
  color?: (typeof OPT_COLORS)[number];
  height?: number;
  italic?: boolean;
  link?: string;
  maxHeight?: number;
  maxWidth?: number;
  valign?: (typeof OPT_VALIGN)[number];
  width?: number;
}
