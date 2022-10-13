import { CellOptions } from './cell-options.type';
import { OPT_ALIGN, OPT_VALIGN, OPT_COLORS, OPT_BORDERS, OPT_SIZES } from './cell-render-options.js';

export function cellOptionsFilter(options: CellOptions): CellOptions {
  const sane: CellOptions = {};
  if (options && typeof options === 'object') {
    if ('align' in options) {
      const align = options.align;
      sane.align = OPT_ALIGN.includes(align!) ? align : undefined;
    }
    if ('valign' in options) {
      const valign = options.valign;
      sane.valign = OPT_VALIGN.includes(valign!) ? valign : undefined;
    }
    if ('color' in options) {
      const color = options.color;
      sane.color = OPT_COLORS.includes(color!) ? color : undefined;
    }
    if ('bold' in options) {
      sane.bold = !!options.bold;
    }
    if ('italic' in options) {
      sane.italic = !!options.italic;
    }
    if ('link' in options) {
      sane.link = typeof options.link === 'string' && options.link.trim() || undefined;
    }
    for (const key of OPT_BORDERS) {
      if (key in options) {
        sane[key] = !!options[key];
      }
    }
    for (const key of OPT_SIZES) {
      if (key in options) {
        const nval = Math.round(+options[key]!);
        sane[key] = nval > 0 ? nval : undefined;
      }
    }
    if ('renderer' in options) {
      const fn = options.renderer;
      sane.renderer = typeof fn === 'function' ? fn : undefined;
    }
  }
  return sane;
}
